const cron = require('node-cron');
const { fetchFixtures } = require('./fetchers/fetchFixtures');
const { fetchStandings } = require('./fetchers/fetchStandings');
const { fetchPlayerStats } = require('./fetchers/fetchPlayerStats');
const { fetchTeamStats } = require('./fetchers/fetchTeamStats');

const runJob = async (name, fn) => {
  // eslint-disable-next-line no-console
  console.log(`[CRON] ${name} started`);
  try {
    const count = await fn();
    // eslint-disable-next-line no-console
    console.log(`[CRON] ${name} completed — ${count} records processed`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[CRON] ${name} failed: ${err.message}`);
  }
};

const registerJobs = () => {
  // Fixtures: cada 4 horas (6 veces/día) — cubre jornadas de fin de semana
  // Requests estimados: 1 (list) + ~2 * partidos terminados
  cron.schedule('0 */4 * * *', () => runJob('fetchFixtures', fetchFixtures));

  // Standings: una vez por día a las 06:00 UTC
  cron.schedule('0 6 * * *', () => runJob('fetchStandings', fetchStandings));

  // Players: una vez por día a las 06:30 UTC
  cron.schedule('30 6 * * *', () => runJob('fetchPlayerStats', fetchPlayerStats));

  // Team stats: una vez por día a las 07:00 UTC
  cron.schedule('0 7 * * *', () => runJob('fetchTeamStats', fetchTeamStats));

  // eslint-disable-next-line no-console
  console.log('[CRON] All jobs registered');
};

module.exports = { registerJobs };
