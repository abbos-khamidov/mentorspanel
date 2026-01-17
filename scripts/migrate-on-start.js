const { execSync } = require('child_process');

console.log('🔄 Checking and applying database migrations...');

try {
  // Apply migrations using Prisma
  execSync('prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('✅ Migrations applied successfully!');
} catch (error) {
  // If migrations are already applied, it's okay
  if (error.message.includes('already') || error.message.includes('No pending')) {
    console.log('✅ Migrations already applied, continuing...');
  } else {
    console.error('⚠️  Migration warning:', error.message);
    console.log('Continuing with application start...');
  }
}
