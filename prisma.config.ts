import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file synchronously
const envPath = resolve(process.cwd(), ".env.local");
const result = config({ path: envPath });

if (result.error) {
  throw new Error(`Failed to load .env.local: ${result.error.message}`);
}

// Get DATABASE_URL from environment
// Note: Prisma Postgres creates DATABBASE_URL (with double B) automatically
const databaseUrl = process.env.DATABBASE_URL || process.env.DATABASE_URL || process.env["DATABBASE_URL"] || process.env["DATABASE_URL"];

if (!databaseUrl) {
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes("DATABASE")));
  throw new Error(
    `DATABASE_URL or DATABBASE_URL environment variable is not set. Please add it to your .env.local file or Vercel Environment Variables.`
  );
}

console.log("Loaded DATABASE_URL from .env.local");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
