import { z } from "zod";

/**
 * Centralised, typed environment access.
 *
 * Validation is LAZY: nothing is parsed at import time, so the public
 * marketing site can build and run before any secrets are configured.
 * The first time a piece of code actually needs Supabase / the database /
 * an AI key, the relevant accessor validates and throws a helpful error.
 */

const serverSchema = z.object({
  // Direct Postgres connection string for Drizzle (Supabase → "Connection string").
  DATABASE_URL: z.string().min(1, "DATABASE_URL ontbreekt"),
  // Supabase service-role key — server-only, bypasses RLS. NEVER expose to the client.
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  // AI providers (optioneel tot de AI-laag live gaat).
  OPENAI_API_KEY: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  // Betalingen.
  MOLLIE_API_KEY: z.string().min(1).optional(),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL moet een geldige URL zijn"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY ontbreekt"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type PublicEnv = z.infer<typeof publicSchema>;

let cachedServer: ServerEnv | null = null;
let cachedPublic: PublicEnv | null = null;

function format(error: z.ZodError): string {
  return error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
}

/** Server-only secrets. Throws with a clear message if misconfigured. */
export function serverEnv(): ServerEnv {
  if (cachedServer) return cachedServer;
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Ongeldige server-omgevingsvariabelen:\n${format(parsed.error)}`);
  }
  cachedServer = parsed.data;
  return cachedServer;
}

/** Public (NEXT_PUBLIC_*) config, safe for the browser. */
export function publicEnv(): PublicEnv {
  if (cachedPublic) return cachedPublic;
  // NEXT_PUBLIC_* are statically inlined by Next, so read them explicitly.
  const parsed = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
  if (!parsed.success) {
    throw new Error(`Ongeldige publieke omgevingsvariabelen:\n${format(parsed.error)}`);
  }
  cachedPublic = parsed.data;
  return cachedPublic;
}

/** Non-throwing guard so middleware / optional features can no-op until Supabase is set up. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** Absolute site URL, with sensible dev fallback. */
export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}
