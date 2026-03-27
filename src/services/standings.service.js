const { getStandings } = require('../models/standings.model');

const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

const getLeagueStandings = async ({ season = SEASON, leagueId = LEAGUE_ID } = {}) => {
  return getStandings(season, leagueId);
};

module.exports = { getLeagueStandings };
