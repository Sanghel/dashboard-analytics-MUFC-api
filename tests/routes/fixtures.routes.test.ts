jest.mock('../../src/services/fixtures.service');

import request from 'supertest';
import app from '../../src/app';
import { getFixtures, getRecent, getUpcoming, getFixtureDetail } from '../../src/services/fixtures.service';

const mockFixture = { id: 1035092, status_short: 'FT', home_goals: 1, away_goals: 0 };

describe('GET /api/fixtures', () => {
  it('returns 200 with fixture list', async () => {
    (getFixtures as jest.Mock).mockResolvedValue([mockFixture]);
    const res = await request(app).get('/api/fixtures');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([mockFixture]);
    expect(res.body.meta.total).toBe(1);
  });
});

describe('GET /api/fixtures/recent', () => {
  it('returns 200 with recent fixtures', async () => {
    (getRecent as jest.Mock).mockResolvedValue([mockFixture]);
    const res = await request(app).get('/api/fixtures/recent?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(getRecent).toHaveBeenCalledWith({ limit: 5, season: undefined });
  });
});

describe('GET /api/fixtures/upcoming', () => {
  it('returns 200 with upcoming fixtures', async () => {
    (getUpcoming as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get('/api/fixtures/upcoming');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });
});

describe('GET /api/fixtures/:id', () => {
  it('returns 200 with fixture detail', async () => {
    (getFixtureDetail as jest.Mock).mockResolvedValue({
      fixture: mockFixture,
      events: [],
      statistics: [],
    });
    const res = await request(app).get('/api/fixtures/1035092');
    expect(res.status).toBe(200);
    expect(res.body.data.fixture.id).toBe(1035092);
  });

  it('returns 404 when fixture does not exist', async () => {
    (getFixtureDetail as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/api/fixtures/9999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
