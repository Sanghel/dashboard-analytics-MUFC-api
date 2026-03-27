jest.mock('../../src/services/team.service');

import request from 'supertest';
import app from '../../src/app';
import { getStats } from '../../src/services/team.service';

describe('GET /api/team/stats', () => {
  it('returns 200 with team stats', async () => {
    const mockStats = { team_id: 33, goals_for_total: 22 };
    (getStats as jest.Mock).mockResolvedValue(mockStats);
    const res = await request(app).get('/api/team/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockStats);
  });

  it('returns 404 when no stats exist', async () => {
    (getStats as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/api/team/stats');
    expect(res.status).toBe(404);
  });
});
