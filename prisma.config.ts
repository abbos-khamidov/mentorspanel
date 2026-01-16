import { defineConfig } from "prisma/config";

// Get DATABASE_URL from environment variables
// Prisma Postgres creates DATABBASE_POSTGRES_URL automatically
const databaseUrl = 
  process.env.DATABBASE_POSTGRES_URL ||
  process.env.DATABBASE_URL ||
  process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("Available env vars:", Object.keys(process.env).filter(k => k.includes("DATABASE")));
  throw new Error(
    `DATABASE_URL or DATABBASE_POSTGRES_URL environment variable is not set.`
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
