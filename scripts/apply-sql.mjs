// Apply a raw .sql file to the database (extensions, RLS policies, seeds).
// Usage: node scripts/apply-sql.mjs supabase/01_extensions.sql
import { readFileSync } from "node:fs";
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });
config();

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/apply-sql.mjs <file.sql>");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL ontbreekt (.env.local)");
  process.exit(1);
}

const sqlText = readFileSync(file, "utf8");
const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  onnotice: () => {},
});

try {
  await sql.unsafe(sqlText).simple();
  console.log(`✓ toegepast: ${file}`);
} catch (err) {
  console.error(`✗ ${file}:`, err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
