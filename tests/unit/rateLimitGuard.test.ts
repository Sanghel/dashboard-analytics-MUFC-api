jest.mock('../../src/models/apiUsage.model');

import { isUnderLimit, incrementUsage, getTodayUsage } from '../../src/models/apiUsage.model';
import { withRateLimit } from '../../src/utils/rateLimitGuard';

describe('withRateLimit', () => {
  beforeEach(() => {
    process.env.API_SAFETY_LIMIT = '95';
  });

  it('executes fn and increments usage when under limit', async () => {
    (isUnderLimit as jest.Mock).mockResolvedValue(true);
    (incrementUsage as jest.Mock).mockResolvedValue(undefined);
    const fn = jest.fn().mockResolvedValue({ data: 'ok' });

    const result = await withRateLimit(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(incrementUsage).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ data: 'ok' });
  });

  it('throws and does not call fn when limit is reached', async () => {
    (isUnderLimit as jest.Mock).mockResolvedValue(false);
    (getTodayUsage as jest.Mock).mockResolvedValue({ request_count: 95 });
    const fn = jest.fn();

    await expect(withRateLimit(fn)).rejects.toThrow('Daily API limit reached');
    expect(fn).not.toHaveBeenCalled();
    expect(incrementUsage).not.toHaveBeenCalled();
  });

  it('does not increment usage when fn throws', async () => {
    (isUnderLimit as jest.Mock).mockResolvedValue(true);
    (incrementUsage as jest.Mock).mockResolvedValue(undefined);
    const fn = jest.fn().mockRejectedValue(new Error('API error'));

    await expect(withRateLimit(fn)).rejects.toThrow('API error');
    expect(incrementUsage).not.toHaveBeenCalled();
  });
});
