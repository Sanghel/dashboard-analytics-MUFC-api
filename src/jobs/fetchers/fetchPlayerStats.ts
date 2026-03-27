import apiClient from '../../utils/apiClient';
import { withRateLimit } from '../../utils/rateLimitGuard';
import { transformPlayer } from '../../utils/transformers';
import { upsertPlayer } from '../../models/players.model';
import { ApiFootballPlayerStats, ApiFootballResponse } from '../../types/api-football';

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

export const fetchPlayerStats = async (): Promise<number> => {
  let page = 1;
  let totalPages = 1;
  let totalSaved = 0;

  do {
    const response = await withRateLimit(() =>
      apiClient.get<ApiFootballResponse<ApiFootballPlayerStats>>('/players', {
        params: { team: TEAM_ID, season: SEASON, page },
      })
    );

    const players = response.data.response || [];
    totalPages = response.data.paging?.total || 1;

    for (const p of players) {
      const player = transformPlayer(p, SEASON, TEAM_ID);
      if (player) {
        await upsertPlayer(player);
      }
    }

    totalSaved += players.length;
    page++;
  } while (page <= totalPages);

  return totalSaved;
};
