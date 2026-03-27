import { getStandings } from '../models/standings.model';
import { DbStanding } from '../types/db';

const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

export const getLeagueStandings = async ({ season = SEASON, leagueId = LEAGUE_ID } = {}): Promise<DbStanding[]> => {
  return getStandings(season, leagueId);
};
