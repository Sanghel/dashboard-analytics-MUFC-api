import apiClient from '../../utils/apiClient';
import { withRateLimit } from '../../utils/rateLimitGuard';
import { transformTeamStats } from '../../utils/transformers';
import { upsertTeamStats } from '../../models/team.model';
import { ApiFootballTeamStats } from '../../types/api-football';

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

export const fetchTeamStats = async (): Promise<number> => {
  const response = await withRateLimit(() =>
    apiClient.get<{ response: ApiFootballTeamStats }>('/teams/statistics', {
      params: { team: TEAM_ID, league: LEAGUE_ID, season: SEASON },
    })
  );

  const stats = response.data.response;
  if (!stats) return 0;

  await upsertTeamStats(transformTeamStats(stats, SEASON, LEAGUE_ID, TEAM_ID));
  return 1;
};
