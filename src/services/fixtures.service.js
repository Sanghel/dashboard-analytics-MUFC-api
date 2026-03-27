const {
  getFixtureById,
  getFixtureEvents,
  getFixtureStatistics,
  getRecentFixtures,
  getUpcomingFixtures,
  getFixturesBySeason,
} = require('../models/fixtures.model');

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

const getFixtures = async ({ season = SEASON } = {}) => {
  return getFixturesBySeason(TEAM_ID, season);
};

const getRecent = async ({ limit = 10, season = SEASON } = {}) => {
  return getRecentFixtures(TEAM_ID, season, limit);
};

const getUpcoming = async ({ limit = 5, season = SEASON } = {}) => {
  return getUpcomingFixtures(TEAM_ID, season, limit);
};

const getFixtureDetail = async (id) => {
  const fixture = await getFixtureById(id);
  if (!fixture) return null;

  const [events, statistics] = await Promise.all([
    getFixtureEvents(id),
    getFixtureStatistics(id),
  ]);

  return { fixture, events, statistics };
};

module.exports = { getFixtures, getRecent, getUpcoming, getFixtureDetail };
