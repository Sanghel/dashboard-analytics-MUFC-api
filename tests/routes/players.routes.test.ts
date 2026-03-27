jest.mock('../../src/services/players.service');

import request from 'supertest';
import app from '../../src/app';
import { getPlayers, getPlayer } from '../../src/services/players.service';

const mockPlayer = { id: 284060, name: 'Bruno Fernandes' };

describe('GET /api/players', () => {
  it('returns 200 with player list', async () => {
    (getPlayers as jest.Mock).mockResolvedValue([mockPlayer]);
    const res = await request(app).get('/api/players');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([mockPlayer]);
    expect(res.body.meta.total).toBe(1);
  });
});

describe('GET /api/players/:id', () => {
  it('returns 200 with player detail', async () => {
    (getPlayer as jest.Mock).mockResolvedValue(mockPlayer);
    const res = await request(app).get('/api/players/284060');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(mockPlayer);
  });

  it('returns 404 when player not found', async () => {
    (getPlayer as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/api/players/9999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
