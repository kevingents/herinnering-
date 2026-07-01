import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnv } from "@/lib/env";
import * as schema from "./schema";

/**
 * Drizzle client over postgres.js. `prepare: false` is required for Supabase's
 * transaction pooler. A single connection is cached in dev to survive HMR.
 */
const globalForDb = globalThis as unknown as {
  __lgClient?: ReturnType<typeof postgres>;
};

function createConnection() {
  const { DATABASE_URL } = serverEnv();
  return postgres(DATABASE_URL, { prepare: false });
}

const client = globalForDb.__lgClient ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  globalForDb.__lgClient = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });
export type Db = typeof db;

export * as schema from "./schema";
