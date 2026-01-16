import { defineConfig } from "prisma/config";

// Get DATABASE_URL from environment variables
// Prisma Postgres creates DATABBASE_POSTGRES_URL automatically
const databaseUrl = 
  process.env.DATABBASE_POSTGRES_URL ||
  process.env.DATABBASE_URL ||
  process.env.DATABASE_URL;

// For prisma generate, we can use a dummy URL if DATABASE_URL is not set
// This is needed during build time when the database URL might not be available yet
// During generation, Prisma doesn't actually connect to the database, so a placeholder is fine
const finalDatabaseUrl = databaseUrl || 'postgresql://dummy:dummy@localhost:5432/dummy?schema=public';

if (!databaseUrl) {
  // Only warn during generate/build, but don't fail
  // At runtime, DATABASE_URL should be set, but we'll let the actual DB connection fail then
  console.warn("Warning: DATABASE_URL not set. Using placeholder URL for Prisma config.");
  console.warn("Available env vars:", Object.keys(process.env).filter(k => k.includes("DATABASE")));
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: finalDatabaseUrl,
  },
});
