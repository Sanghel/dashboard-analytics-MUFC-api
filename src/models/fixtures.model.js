const { pool } = require('../config/db');

const upsertFixture = async (fixture) => {
  const sql = `
    INSERT INTO fixtures (
      id, referee, date, timestamp, venue_name, venue_city,
      status_long, status_short, status_elapsed,
      home_team_id, home_team_name, home_team_logo,
      away_team_id, away_team_name, away_team_logo,
      home_goals, away_goals, season, league_id, round
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      referee = VALUES(referee),
      status_long = VALUES(status_long),
      status_short = VALUES(status_short),
      status_elapsed = VALUES(status_elapsed),
      home_goals = VALUES(home_goals),
      away_goals = VALUES(away_goals),
      updated_at = CURRENT_TIMESTAMP
  `;
  const params = [
    fixture.id, fixture.referee, fixture.date, fixture.timestamp,
    fixture.venue_name, fixture.venue_city,
    fixture.status_long, fixture.status_short, fixture.status_elapsed,
    fixture.home_team_id, fixture.home_team_name, fixture.home_team_logo,
    fixture.away_team_id, fixture.away_team_name, fixture.away_team_logo,
    fixture.home_goals, fixture.away_goals,
    fixture.season, fixture.league_id, fixture.round,
  ];
  await pool.execute(sql, params);
};

const upsertFixtureEvents = async (fixtureId, events) => {
  await pool.execute('DELETE FROM fixture_events WHERE fixture_id = ?', [fixtureId]);
  if (!events.length) return;

  const placeholders = events.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
  const values = events.flatMap((e) => [
    fixtureId, e.time_elapsed, e.time_extra,
    e.team_id, e.team_name,
    e.player_id, e.player_name,
    e.assist_id, e.assist_name,
    e.type, e.detail, e.comments,
  ]);
  await pool.execute(
    `INSERT INTO fixture_events
      (fixture_id, time_elapsed, time_extra, team_id, team_name,
       player_id, player_name, assist_id, assist_name, type, detail, comments)
     VALUES ${placeholders}`,
    values
  );
};

const upsertFixtureStatistics = async (fixtureId, statistics) => {
  await pool.execute('DELETE FROM fixture_statistics WHERE fixture_id = ?', [fixtureId]);
  if (!statistics.length) return;

  const placeholders = statistics.map(() => '(?, ?, ?, ?, ?)').join(', ');
  const values = statistics.flatMap((s) => [
    fixtureId, s.team_id, s.team_name, s.stat_type, s.stat_value,
  ]);
  await pool.execute(
    `INSERT INTO fixture_statistics (fixture_id, team_id, team_name, stat_type, stat_value)
     VALUES ${placeholders}`,
    values
  );
};

const getFixtureById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM fixtures WHERE id = ?', [id]);
  return rows[0] || null;
};

const getFixtureEvents = async (fixtureId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM fixture_events WHERE fixture_id = ? ORDER BY time_elapsed ASC',
    [fixtureId]
  );
  return rows;
};

const getFixtureStatistics = async (fixtureId) => {
  const [rows] = await pool.execute(
    'SELECT * FROM fixture_statistics WHERE fixture_id = ?',
    [fixtureId]
  );
  return rows;
};

const getRecentFixtures = async (teamId, season, limit = 10) => {
  const [rows] = await pool.execute(
    `SELECT * FROM fixtures
     WHERE (home_team_id = ? OR away_team_id = ?)
       AND season = ?
       AND status_short IN ('FT', 'AET', 'PEN')
     ORDER BY date DESC
     LIMIT ?`,
    [teamId, teamId, season, limit]
  );
  return rows;
};

const getUpcomingFixtures = async (teamId, season, limit = 5) => {
  const [rows] = await pool.execute(
    `SELECT * FROM fixtures
     WHERE (home_team_id = ? OR away_team_id = ?)
       AND season = ?
       AND status_short IN ('NS', 'TBD')
     ORDER BY date ASC
     LIMIT ?`,
    [teamId, teamId, season, limit]
  );
  return rows;
};

const getFixturesBySeason = async (teamId, season) => {
  const [rows] = await pool.execute(
    `SELECT * FROM fixtures
     WHERE (home_team_id = ? OR away_team_id = ?)
       AND season = ?
     ORDER BY date ASC`,
    [teamId, teamId, season]
  );
  return rows;
};

module.exports = {
  upsertFixture,
  upsertFixtureEvents,
  upsertFixtureStatistics,
  getFixtureById,
  getFixtureEvents,
  getFixtureStatistics,
  getRecentFixtures,
  getUpcomingFixtures,
  getFixturesBySeason,
};
