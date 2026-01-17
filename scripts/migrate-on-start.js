const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Checking and applying database migrations...');

// Check if DATABASE_URL is available
const databaseUrl = process.env.DATABASE_URL || process.env.DATABBASE_POSTGRES_URL || process.env.DATABBASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in environment variables');
  console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
  console.log('⚠️  Skipping migrations - continuing with application start...');
  process.exit(0); // Don't fail app startup
}

console.log('✅ DATABASE_URL found, applying migrations...');

try {
  // Use the apply-migrations script instead of prisma migrate deploy
  // This avoids issues with prisma.config.ts not reading env vars correctly
  const scriptPath = path.join(__dirname, 'apply-migrations.js');
  execSync(`node ${scriptPath}`, {
    stdio: 'inherit',
    env: process.env,
    cwd: path.join(__dirname, '..'),
  });
  console.log('✅ Migrations applied successfully!');
} catch (error) {
  // If migrations are already applied, it's okay
  if (error.message && (error.message.includes('already exists') || error.message.includes('already applied'))) {
    console.log('✅ Migrations already applied, continuing...');
  } else {
    console.error('⚠️  Migration warning:', error.message || error);
    console.log('Continuing with application start...');
    // Don't exit - let the app start anyway
  }
}
