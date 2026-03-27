import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { DbApiUsage } from '../types/db';

export const getTodayUsage = async (): Promise<DbApiUsage | null> => {
  const today = new Date().toISOString().slice(0, 10);
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM api_usage WHERE date = ?',
    [today]
  );
  return (rows[0] as DbApiUsage) || null;
};

export const incrementUsage = async (): Promise<void> => {
  const today = new Date().toISOString().slice(0, 10);
  await pool.execute(
    `INSERT INTO api_usage (date, request_count)
     VALUES (?, 1)
     ON DUPLICATE KEY UPDATE
       request_count = request_count + 1,
       last_updated = CURRENT_TIMESTAMP`,
    [today]
  );
};

export const isUnderLimit = async (limit: number): Promise<boolean> => {
  const usage = await getTodayUsage();
  const count = usage ? usage.request_count : 0;
  return count < limit;
};
