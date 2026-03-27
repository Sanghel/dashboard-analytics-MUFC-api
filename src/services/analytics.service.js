const { getRecentFixtures, getUpcomingFixtures } = require('../models/fixtures.model');
const { getStandings } = require('../models/standings.model');
const { getTeamStats } = require('../models/team.model');
const { getTodayUsage } = require('../models/apiUsage.model');

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

const getOverview = async () => {
  const [recent, upcoming, standings, teamStats, apiUsage] = await Promise.all([
    getRecentFixtures(TEAM_ID, SEASON, 5),
    getUpcomingFixtures(TEAM_ID, SEASON, 3),
    getStandings(SEASON, LEAGUE_ID),
    getTeamStats(TEAM_ID, SEASON, LEAGUE_ID),
    getTodayUsage(),
  ]);

  const mufcStanding = standings.find((s) => s.team_id === TEAM_ID) || null;

  const form = recent
    .slice()
    .reverse()
    .map((f) => {
      if (f.home_goals === null || f.away_goals === null) return null;
      const mufcIsHome = f.home_team_id === TEAM_ID;
      const mufcGoals = mufcIsHome ? f.home_goals : f.away_goals;
      const oppGoals = mufcIsHome ? f.away_goals : f.home_goals;
      if (mufcGoals > oppGoals) return 'W';
      if (mufcGoals < oppGoals) return 'L';
      return 'D';
    })
    .filter(Boolean);

  return {
    season: SEASON,
    standing: mufcStanding,
    form,
    recent_fixtures: recent,
    upcoming_fixtures: upcoming,
    team_stats: teamStats,
    api_usage: apiUsage
      ? {
          requests_today: apiUsage.request_count,
          daily_limit: parseInt(process.env.API_DAILY_LIMIT || '100', 10),
          safety_limit: parseInt(process.env.API_SAFETY_LIMIT || '95', 10),
        }
      : null,
  };
};

module.exports = { getOverview };
