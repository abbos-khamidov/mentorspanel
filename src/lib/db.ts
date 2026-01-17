import { PrismaClient } from '@/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 requires a driver adapter for PostgreSQL
// Note: Railway PostgreSQL creates DATABASE_URL automatically
const connectionString = 
  process.env.DATABASE_URL || 
  process.env.DATABBASE_POSTGRES_URL ||
  process.env.DATABBASE_URL;

if (!connectionString) {
  const errorMessage = `
❌ DATABASE_URL environment variable is not set!

Available environment variables containing 'DATABASE':
${Object.keys(process.env).filter(k => k.includes('DATABASE')).map(k => `  - ${k}`).join('\n') || '  (none found)'}

Please ensure:
1. PostgreSQL service is added to your Railway project
2. DATABASE_URL is available in your Railway service environment variables
3. Services are properly linked in Railway project settings
`;
  console.error(errorMessage);
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a pg Pool with connection settings
const pool = new Pool({ 
  connectionString,
  // Railway internal connections work without SSL
  ssl: connectionString.includes('.railway.app') ? { rejectUnauthorized: false } : false,
});

// Add error handling for pool
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err);
});

const adapter = new PrismaPg(pool);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
