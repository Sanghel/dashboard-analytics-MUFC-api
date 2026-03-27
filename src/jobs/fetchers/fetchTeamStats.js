const apiClient = require('../../utils/apiClient');
const { withRateLimit } = require('../../utils/rateLimitGuard');
const { transformTeamStats } = require('../../utils/transformers');
const { upsertTeamStats } = require('../../models/team.model');

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

const fetchTeamStats = async () => {
  const response = await withRateLimit(() =>
    apiClient.get('/teams/statistics', {
      params: { team: TEAM_ID, league: LEAGUE_ID, season: SEASON },
    })
  );

  const stats = response.data.response;
  if (!stats) return 0;

  await upsertTeamStats(transformTeamStats(stats, SEASON, LEAGUE_ID, TEAM_ID));
  return 1;
};

module.exports = { fetchTeamStats };
