const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Get connection string from environment
const connectionString = 
  process.env.DATABBASE_POSTGRES_URL ||
  process.env.DATABBASE_URL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function applyMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('📦 Connecting to database...');
    
    // Read and execute SQL from DEPLOY_SQL.sql
    const sqlPath = path.join(__dirname, '..', 'DEPLOY_SQL.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('🔄 Applying migrations...');
    
    // Split by migration sections and execute
    const migrations = sql.split('-- ============================================');
    
    for (const migration of migrations) {
      if (!migration.trim() || migration.includes('SQL для ручного применения')) {
        continue;
      }
      
      // Execute each migration
      try {
        await client.query(migration);
        console.log('✅ Applied migration section');
      } catch (error) {
        // If table/column already exists, it's okay
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate') ||
            error.code === '42P07' || // duplicate_table
            error.code === '42710') { // duplicate_object
          console.log('⚠️  Skipped (already exists):', error.message.split('\n')[0]);
          continue;
        }
        throw error;
      }
    }
    
    console.log('✅ All migrations applied successfully!');
    
  } catch (error) {
    console.error('❌ Error applying migrations:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

applyMigrations();
