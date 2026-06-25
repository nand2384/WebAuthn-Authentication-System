import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import env from '../config/env';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Running migrations...');
    // Drop password and add current_challenge
    await client.query(`
      ALTER TABLE users DROP COLUMN IF EXISTS password;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS current_challenge VARCHAR(255);
    `);
    
    // Apply schema.sql
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schema);
    
    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
