const { getTeamStats } = require('../models/team.model');

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

const getStats = async ({ season = SEASON, leagueId = LEAGUE_ID } = {}) => {
  return getTeamStats(TEAM_ID, season, leagueId);
};

module.exports = { getStats };
