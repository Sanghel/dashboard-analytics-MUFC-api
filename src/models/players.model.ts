import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { DbPlayer } from '../types/db';

export const upsertPlayer = async (player: DbPlayer): Promise<void> => {
  const sql = `
    INSERT INTO players (
      id, name, firstname, lastname, age, nationality, position, photo,
      season, team_id, appearances, lineups, minutes,
      goals, assists, yellow_cards, red_cards,
      shots_total, shots_on, passes_total, passes_accuracy,
      tackles_total, dribbles_success, rating
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      age = VALUES(age),
      appearances = VALUES(appearances),
      lineups = VALUES(lineups),
      minutes = VALUES(minutes),
      goals = VALUES(goals),
      assists = VALUES(assists),
      yellow_cards = VALUES(yellow_cards),
      red_cards = VALUES(red_cards),
      shots_total = VALUES(shots_total),
      shots_on = VALUES(shots_on),
      passes_total = VALUES(passes_total),
      passes_accuracy = VALUES(passes_accuracy),
      tackles_total = VALUES(tackles_total),
      dribbles_success = VALUES(dribbles_success),
      rating = VALUES(rating),
      updated_at = CURRENT_TIMESTAMP
  `;
  const params = [
    player.id, player.name, player.firstname, player.lastname,
    player.age, player.nationality, player.position, player.photo,
    player.season, player.team_id,
    player.appearances, player.lineups, player.minutes,
    player.goals, player.assists, player.yellow_cards, player.red_cards,
    player.shots_total, player.shots_on,
    player.passes_total, player.passes_accuracy,
    player.tackles_total, player.dribbles_success, player.rating,
  ];
  await pool.execute(sql, params);
};

export const getPlayersBySeason = async (teamId: number, season: number): Promise<DbPlayer[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM players WHERE team_id = ? AND season = ? ORDER BY appearances DESC',
    [teamId, season]
  );
  return rows as DbPlayer[];
};

export const getPlayerById = async (id: number, season: number): Promise<DbPlayer | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM players WHERE id = ? AND season = ?',
    [id, season]
  );
  return (rows[0] as DbPlayer) || null;
};
