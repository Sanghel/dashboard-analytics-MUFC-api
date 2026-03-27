import { getTeamStats } from '../models/team.model';
import { getTeamInfo } from '../models/standings.model';
import { DbTeamStats, DbTeamInfo } from '../types/db';

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

export const getStats = async ({ season = SEASON, leagueId = LEAGUE_ID } = {}): Promise<DbTeamStats | null> => {
  return getTeamStats(TEAM_ID, season, leagueId);
};

export const getInfo = async ({ season = SEASON, leagueId = LEAGUE_ID } = {}): Promise<DbTeamInfo | null> => {
  return getTeamInfo(TEAM_ID, season, leagueId);
};
