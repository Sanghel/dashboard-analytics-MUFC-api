import { getPlayersBySeason, getPlayerById } from '../models/players.model';
import { DbPlayer } from '../types/db';

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

export const getPlayers = async ({ season = SEASON } = {}): Promise<DbPlayer[]> => {
  return getPlayersBySeason(TEAM_ID, season);
};

export const getPlayer = async (id: number, { season = SEASON } = {}): Promise<DbPlayer | null> => {
  return getPlayerById(id, season);
};
