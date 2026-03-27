import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';
import { DbStanding, DbTeamInfo } from '../types/db';

export const upsertStanding = async (standing: DbStanding): Promise<void> => {
  const sql = `
    INSERT INTO standings (
      season, league_id, team_id, team_name, team_logo,
      rank, points, goals_diff, form, status, description,
      played, win, draw, lose, goals_for, goals_against,
      home_played, home_win, home_draw, home_lose, home_goals_for, home_goals_against,
      away_played, away_win, away_draw, away_lose, away_goals_for, away_goals_against
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      team_name = VALUES(team_name),
      team_logo = VALUES(team_logo),
      rank = VALUES(rank),
      points = VALUES(points),
      goals_diff = VALUES(goals_diff),
      form = VALUES(form),
      status = VALUES(status),
      description = VALUES(description),
      played = VALUES(played),
      win = VALUES(win),
      draw = VALUES(draw),
      lose = VALUES(lose),
      goals_for = VALUES(goals_for),
      goals_against = VALUES(goals_against),
      home_played = VALUES(home_played),
      home_win = VALUES(home_win),
      home_draw = VALUES(home_draw),
      home_lose = VALUES(home_lose),
      home_goals_for = VALUES(home_goals_for),
      home_goals_against = VALUES(home_goals_against),
      away_played = VALUES(away_played),
      away_win = VALUES(away_win),
      away_draw = VALUES(away_draw),
      away_lose = VALUES(away_lose),
      away_goals_for = VALUES(away_goals_for),
      away_goals_against = VALUES(away_goals_against),
      updated_at = CURRENT_TIMESTAMP
  `;
  const params = [
    standing.season, standing.league_id, standing.team_id,
    standing.team_name, standing.team_logo,
    standing.rank, standing.points, standing.goals_diff,
    standing.form, standing.status, standing.description,
    standing.played, standing.win, standing.draw, standing.lose,
    standing.goals_for, standing.goals_against,
    standing.home_played, standing.home_win, standing.home_draw, standing.home_lose,
    standing.home_goals_for, standing.home_goals_against,
    standing.away_played, standing.away_win, standing.away_draw, standing.away_lose,
    standing.away_goals_for, standing.away_goals_against,
  ];
  await pool.execute(sql, params);
};

export const getStandings = async (season: number, leagueId: number): Promise<DbStanding[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT * FROM standings WHERE season = ? AND league_id = ? ORDER BY rank ASC',
    [season, leagueId]
  );
  return rows as DbStanding[];
};

export const getTeamInfo = async (teamId: number, season: number, leagueId: number): Promise<DbTeamInfo | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT team_id, team_name, team_logo FROM standings WHERE team_id = ? AND season = ? AND league_id = ? LIMIT 1',
    [teamId, season, leagueId]
  );
  return (rows[0] as DbTeamInfo) || null;
};
