jest.mock('../../src/services/team.service');

const request = require('supertest');
const app = require('../../src/app');
const { getStats } = require('../../src/services/team.service');

describe('GET /api/team/stats', () => {
  it('returns 200 with team stats', async () => {
    const mockStats = { team_id: 33, goals_for_total: 22 };
    getStats.mockResolvedValue(mockStats);
    const res = await request(app).get('/api/team/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockStats);
  });

  it('returns 404 when no stats exist', async () => {
    getStats.mockResolvedValue(null);
    const res = await request(app).get('/api/team/stats');
    expect(res.status).toBe(404);
  });
});
