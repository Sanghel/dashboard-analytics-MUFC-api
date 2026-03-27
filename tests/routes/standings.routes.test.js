jest.mock('../../src/services/standings.service');

const request = require('supertest');
const app = require('../../src/app');
const { getLeagueStandings } = require('../../src/services/standings.service');

describe('GET /api/standings', () => {
  it('returns 200 with standings array', async () => {
    const mockData = [{ team_id: 33, rank: 8, points: 27 }];
    getLeagueStandings.mockResolvedValue(mockData);

    const res = await request(app).get('/api/standings');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockData);
    expect(res.body.meta.total).toBe(1);
  });

  it('forwards season query param', async () => {
    getLeagueStandings.mockResolvedValue([]);
    await request(app).get('/api/standings?season=2023');
    expect(getLeagueStandings).toHaveBeenCalledWith({ season: 2023, leagueId: undefined });
  });
});
