const apiClient = require('../../utils/apiClient');
const { withRateLimit } = require('../../utils/rateLimitGuard');
const { transformStanding } = require('../../utils/transformers');
const { upsertStanding } = require('../../models/standings.model');

const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

const fetchStandings = async () => {
  const response = await withRateLimit(() =>
    apiClient.get('/standings', {
      params: { league: LEAGUE_ID, season: SEASON },
    })
  );

  const league = response.data.response?.[0]?.league;
  const standings = league?.standings?.[0] || [];

  for (const standing of standings) {
    await upsertStanding(transformStanding(standing, SEASON, LEAGUE_ID));
  }

  return standings.length;
};

module.exports = { fetchStandings };
