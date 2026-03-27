const { pool } = require('../config/db');

const upsertTeamStats = async (stats) => {
  const sql = `
    INSERT INTO team_stats (
      season, league_id, team_id, form,
      fixtures_played_home, fixtures_played_away,
      fixtures_wins_home, fixtures_wins_away,
      fixtures_draws_home, fixtures_draws_away,
      fixtures_loses_home, fixtures_loses_away,
      goals_for_total, goals_against_total,
      goals_for_avg_home, goals_for_avg_away,
      biggest_win_home, biggest_win_away,
      biggest_lose_home, biggest_lose_away,
      clean_sheet_home, clean_sheet_away,
      penalty_scored, penalty_missed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      form = VALUES(form),
      fixtures_played_home = VALUES(fixtures_played_home),
      fixtures_played_away = VALUES(fixtures_played_away),
      fixtures_wins_home = VALUES(fixtures_wins_home),
      fixtures_wins_away = VALUES(fixtures_wins_away),
      fixtures_draws_home = VALUES(fixtures_draws_home),
      fixtures_draws_away = VALUES(fixtures_draws_away),
      fixtures_loses_home = VALUES(fixtures_loses_home),
      fixtures_loses_away = VALUES(fixtures_loses_away),
      goals_for_total = VALUES(goals_for_total),
      goals_against_total = VALUES(goals_against_total),
      goals_for_avg_home = VALUES(goals_for_avg_home),
      goals_for_avg_away = VALUES(goals_for_avg_away),
      biggest_win_home = VALUES(biggest_win_home),
      biggest_win_away = VALUES(biggest_win_away),
      biggest_lose_home = VALUES(biggest_lose_home),
      biggest_lose_away = VALUES(biggest_lose_away),
      clean_sheet_home = VALUES(clean_sheet_home),
      clean_sheet_away = VALUES(clean_sheet_away),
      penalty_scored = VALUES(penalty_scored),
      penalty_missed = VALUES(penalty_missed),
      updated_at = CURRENT_TIMESTAMP
  `;
  const params = [
    stats.season, stats.league_id, stats.team_id, stats.form,
    stats.fixtures_played_home, stats.fixtures_played_away,
    stats.fixtures_wins_home, stats.fixtures_wins_away,
    stats.fixtures_draws_home, stats.fixtures_draws_away,
    stats.fixtures_loses_home, stats.fixtures_loses_away,
    stats.goals_for_total, stats.goals_against_total,
    stats.goals_for_avg_home, stats.goals_for_avg_away,
    stats.biggest_win_home, stats.biggest_win_away,
    stats.biggest_lose_home, stats.biggest_lose_away,
    stats.clean_sheet_home, stats.clean_sheet_away,
    stats.penalty_scored, stats.penalty_missed,
  ];
  await pool.execute(sql, params);
};

const getTeamStats = async (teamId, season, leagueId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM team_stats WHERE team_id = ? AND season = ? AND league_id = ?',
    [teamId, season, leagueId]
  );
  return rows[0] || null;
};

module.exports = { upsertTeamStats, getTeamStats };
