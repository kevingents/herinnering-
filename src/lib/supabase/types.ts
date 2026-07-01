/**
 * Supabase database types.
 *
 * Permissive placeholder that satisfies the supabase-js generic. Generated
 * types need Docker (the CLI runs pg-meta in a container). Once available,
 * regenerate with either:
 *
 *   npx supabase gen types typescript --project-id bwnkehuadfodofnatmry > src/lib/supabase/types.ts
 *   # or, with Docker:  --db-url "$DATABASE_URL"
 *
 * The Drizzle schema in `src/lib/db/schema` remains the source of truth for
 * table shapes; use `typeof <table>.$inferSelect` for typed rows meanwhile.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Row = Record<string, unknown>;

export type Database = {
  public: {
    Tables: Record<
      string,
      { Row: Row; Insert: Row; Update: Row; Relationships: [] }
    >;
    Views: Record<string, { Row: Row; Relationships: [] }>;
    Functions: Record<string, { Args: Record<string, unknown>; Returns: unknown }>;
    Enums: Record<string, string>;
    CompositeTypes: Record<string, Record<string, unknown>>;
  };
};
