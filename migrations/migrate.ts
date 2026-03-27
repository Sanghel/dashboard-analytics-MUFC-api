import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { pool } from '../src/config/db';

const run = async (): Promise<void> => {
  const sqlFile = path.join(__dirname, '001_initial_schema.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  const statements = sql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'));

  const conn = await pool.getConnection();
  try {
    for (const statement of statements) {
      await conn.query(statement);
    }
    // eslint-disable-next-line no-console
    console.log('Migration completed successfully');
  } finally {
    conn.release();
    await pool.end();
  }
};

run().catch((err: Error) => {
  // eslint-disable-next-line no-console
  console.error('Migration failed:', err.message);
  process.exit(1);
});
