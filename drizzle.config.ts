import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Drizzle Kit runs standalone (not through Next), so load env explicitly.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "./src/lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  casing: "snake_case",
  strict: true,
  verbose: true,
});
