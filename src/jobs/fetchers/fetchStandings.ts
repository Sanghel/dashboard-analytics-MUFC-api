import apiClient from '../../utils/apiClient';
import { withRateLimit } from '../../utils/rateLimitGuard';
import { transformStanding } from '../../utils/transformers';
import { upsertStanding } from '../../models/standings.model';
import { ApiFootballStanding } from '../../types/api-football';

const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

export const fetchStandings = async (): Promise<number> => {
  const response = await withRateLimit(() =>
    apiClient.get('/standings', {
      params: { league: LEAGUE_ID, season: SEASON },
    })
  );

  const league = response.data.response?.[0]?.league;
  const standings: ApiFootballStanding[] = league?.standings?.[0] || [];

  for (const standing of standings) {
    await upsertStanding(transformStanding(standing, SEASON, LEAGUE_ID));
  }

  return standings.length;
};
