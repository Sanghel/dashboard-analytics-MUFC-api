jest.mock('../../src/models/standings.model');

import { getStandings } from '../../src/models/standings.model';
import { getLeagueStandings } from '../../src/services/standings.service';

const mockStandings = [
  { team_id: 33, rank: 8, points: 27 },
  { team_id: 1, rank: 1, points: 52 },
];

describe('standings.service', () => {
  beforeEach(() => {
    process.env.PREMIER_LEAGUE_ID = '39';
    process.env.CURRENT_SEASON = '2024';
  });

  it('calls getStandings with default season and leagueId', async () => {
    (getStandings as jest.Mock).mockResolvedValue(mockStandings);
    const result = await getLeagueStandings();
    expect(getStandings).toHaveBeenCalledWith(2024, 39);
    expect(result).toEqual(mockStandings);
  });

  it('forwards custom season and leagueId', async () => {
    (getStandings as jest.Mock).mockResolvedValue([]);
    await getLeagueStandings({ season: 2023, leagueId: 135 });
    expect(getStandings).toHaveBeenCalledWith(2023, 135);
  });
});
