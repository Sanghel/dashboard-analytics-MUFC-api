const { pool } = require('../config/db');

const getTodayUsage = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const [rows] = await pool.execute(
    'SELECT * FROM api_usage WHERE date = ?',
    [today]
  );
  return rows[0] || null;
};

const incrementUsage = async () => {
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

const isUnderLimit = async (limit) => {
  const usage = await getTodayUsage();
  const count = usage ? usage.request_count : 0;
  return count < limit;
};

module.exports = { getTodayUsage, incrementUsage, isUnderLimit };
