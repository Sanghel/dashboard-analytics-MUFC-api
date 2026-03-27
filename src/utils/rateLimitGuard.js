const { isUnderLimit, incrementUsage, getTodayUsage } = require('../models/apiUsage.model');

const withRateLimit = async (fn) => {
  const limit = parseInt(process.env.API_SAFETY_LIMIT || '95', 10);
  const allowed = await isUnderLimit(limit);

  if (!allowed) {
    const usage = await getTodayUsage();
    throw new Error(
      `Daily API limit reached (${usage ? usage.request_count : limit}/${limit}). Skipping request.`
    );
  }

  const result = await fn();
  await incrementUsage();
  return result;
};

module.exports = { withRateLimit };
