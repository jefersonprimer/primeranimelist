import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

const defaultDbUrl = process.env.DATABASE_URL;
const drizzleKitUrl =
  process.env.DATABASE_URL_DRIZZLE_KIT ??
  defaultDbUrl?.replace(".pooler.supabase.com:6543", ".pooler.supabase.com:5432");

if (!drizzleKitUrl) {
  throw new Error("DATABASE_URL or DATABASE_URL_DRIZZLE_KIT is not set in .env file");
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    url: drizzleKitUrl,
  },
});
