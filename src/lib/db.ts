import { PrismaClient } from '@/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 requires a driver adapter for PostgreSQL
// Note: Prisma Postgres creates DATABBASE_POSTGRES_URL automatically
const connectionString = 
  process.env.DATABBASE_URL || 
  process.env.DATABBASE_POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL or DATABBASE_URL environment variable is not set. Please add it to your .env.local file or Vercel Environment Variables.'
  );
}

// Create a pg Pool
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
