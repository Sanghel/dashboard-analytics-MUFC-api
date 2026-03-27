jest.mock('../../src/models/players.model');

import { getPlayersBySeason, getPlayerById } from '../../src/models/players.model';
import { getPlayers, getPlayer } from '../../src/services/players.service';

const mockPlayers = [{ id: 284060, name: 'Bruno Fernandes' }];

describe('players.service', () => {
  beforeEach(() => {
    process.env.MUFC_TEAM_ID = '33';
    process.env.CURRENT_SEASON = '2024';
  });

  describe('getPlayers', () => {
    it('calls getPlayersBySeason with defaults', async () => {
      (getPlayersBySeason as jest.Mock).mockResolvedValue(mockPlayers);
      const result = await getPlayers();
      expect(getPlayersBySeason).toHaveBeenCalledWith(33, 2024);
      expect(result).toEqual(mockPlayers);
    });
  });

  describe('getPlayer', () => {
    it('returns the player when found', async () => {
      (getPlayerById as jest.Mock).mockResolvedValue(mockPlayers[0]);
      const result = await getPlayer(284060);
      expect(getPlayerById).toHaveBeenCalledWith(284060, 2024);
      expect(result).toEqual(mockPlayers[0]);
    });

    it('returns null when player does not exist', async () => {
      (getPlayerById as jest.Mock).mockResolvedValue(null);
      const result = await getPlayer(999);
      expect(result).toBeNull();
    });
  });
});
