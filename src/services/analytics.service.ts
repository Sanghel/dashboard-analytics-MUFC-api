import { getRecentFixtures, getUpcomingFixtures } from '../models/fixtures.model';
import { getStandings } from '../models/standings.model';
import { getTeamStats } from '../models/team.model';
import { getTodayUsage } from '../models/apiUsage.model';
import { DbFixture, DbStanding, DbTeamStats, DbApiUsage } from '../types/db';

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

interface OverviewResult {
  season: number;
  standing: DbStanding | null;
  form: string[];
  recent_fixtures: DbFixture[];
  upcoming_fixtures: DbFixture[];
  team_stats: DbTeamStats | null;
  api_usage: {
    requests_today: number;
    daily_limit: number;
    safety_limit: number;
  } | null;
}

export const getOverview = async (): Promise<OverviewResult> => {
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
      if (mufcGoals !== null && oppGoals !== null) {
        if (mufcGoals > oppGoals) return 'W';
        if (mufcGoals < oppGoals) return 'L';
      }
      return 'D';
    })
    .filter((v): v is NonNullable<typeof v> => v !== null);

  return {
    season: SEASON,
    standing: mufcStanding,
    form,
    recent_fixtures: recent,
    upcoming_fixtures: upcoming,
    team_stats: teamStats,
    api_usage: apiUsage
      ? {
          requests_today: (apiUsage as DbApiUsage).request_count,
          daily_limit: parseInt(process.env.API_DAILY_LIMIT || '100', 10),
          safety_limit: parseInt(process.env.API_SAFETY_LIMIT || '95', 10),
        }
      : null,
  };
};
