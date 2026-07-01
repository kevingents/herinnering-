// Quick health check: tables, extensions, RLS coverage, policy count.
// Usage: node scripts/db-check.mjs
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });
config();

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  onnotice: () => {},
});

try {
  const tables = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public' order by table_name`;
  const ext = await sql`
    select extname from pg_extension where extname in ('vector', 'pgcrypto')`;
  const rls = await sql`
    select relname from pg_class
    where relnamespace = 'public'::regnamespace and relrowsecurity = true`;
  const pol = await sql`
    select count(*)::int as n from pg_policies where schemaname = 'public'`;
  const trig = await sql`
    select tgname from pg_trigger where tgname = 'on_auth_user_created'`;

  console.log(`tables (${tables.length}):`, tables.map((t) => t.table_name).join(", "));
  console.log(`extensions:`, ext.map((e) => e.extname).join(", ") || "(none)");
  console.log(`RLS-enabled tables: ${rls.length}`);
  console.log(`policies: ${pol[0].n}`);
  console.log(`new-user trigger: ${trig.length ? "present" : "MISSING"}`);
} catch (err) {
  console.error("db-check failed:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
