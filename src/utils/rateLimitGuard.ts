import { isUnderLimit, incrementUsage, getTodayUsage } from '../models/apiUsage.model';

export const withRateLimit = async <T>(fn: () => Promise<T>): Promise<T> => {
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
