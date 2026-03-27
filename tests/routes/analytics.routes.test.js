jest.mock('../../src/services/analytics.service');

const request = require('supertest');
const app = require('../../src/app');
const { getOverview } = require('../../src/services/analytics.service');

describe('GET /api/analytics/overview', () => {
  it('returns 200 with overview data', async () => {
    const mockOverview = {
      season: 2024,
      form: ['W', 'D', 'W'],
      standing: { rank: 8, points: 27 },
      recent_fixtures: [],
      upcoming_fixtures: [],
      team_stats: {},
      api_usage: { requests_today: 5, daily_limit: 100 },
    };
    getOverview.mockResolvedValue(mockOverview);

    const res = await request(app).get('/api/analytics/overview');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.form).toEqual(['W', 'D', 'W']);
    expect(res.body.data.api_usage.requests_today).toBe(5);
  });

  it('returns 500 when service throws', async () => {
    getOverview.mockRejectedValue(new Error('DB error'));
    const res = await request(app).get('/api/analytics/overview');
    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.success).toBe(true);
  });
});
