const { getPlayersBySeason, getPlayerById } = require('../models/players.model');

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

const getPlayers = async ({ season = SEASON } = {}) => {
  return getPlayersBySeason(TEAM_ID, season);
};

const getPlayer = async (id, { season = SEASON } = {}) => {
  return getPlayerById(id, season);
};

module.exports = { getPlayers, getPlayer };
