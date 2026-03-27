const apiClient = require('../../utils/apiClient');
const { withRateLimit } = require('../../utils/rateLimitGuard');
const { transformPlayer } = require('../../utils/transformers');
const { upsertPlayer } = require('../../models/players.model');

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

const fetchPlayerStats = async () => {
  let page = 1;
  let totalPages = 1;
  let totalSaved = 0;

  do {
    const response = await withRateLimit(() =>
      apiClient.get('/players', {
        params: { team: TEAM_ID, season: SEASON, page },
      })
    );

    const players = response.data.response || [];
    totalPages = response.data.paging?.total || 1;

    for (const p of players) {
      await upsertPlayer(transformPlayer(p, SEASON, TEAM_ID));
    }

    totalSaved += players.length;
    page++;
  } while (page <= totalPages);

  return totalSaved;
};

module.exports = { fetchPlayerStats };
