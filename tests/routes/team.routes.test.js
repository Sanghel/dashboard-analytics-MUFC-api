jest.mock('../../src/services/team.service');

const request = require('supertest');
const app = require('../../src/app');
const { getStats, getInfo } = require('../../src/services/team.service');

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

describe('GET /api/team/info', () => {
  it('returns 200 with team info', async () => {
    const mockInfo = { team_id: 33, team_name: 'Manchester United', team_logo: 'https://logo.com/mu.png' };
    getInfo.mockResolvedValue(mockInfo);
    const res = await request(app).get('/api/team/info');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockInfo);
  });

  it('returns 404 when team info not found', async () => {
    getInfo.mockResolvedValue(null);
    const res = await request(app).get('/api/team/info');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
