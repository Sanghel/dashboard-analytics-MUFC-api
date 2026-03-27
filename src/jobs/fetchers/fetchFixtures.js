const apiClient = require('../../utils/apiClient');
const { withRateLimit } = require('../../utils/rateLimitGuard');
const {
  transformFixture,
  transformFixtureEvent,
  transformFixtureStat,
} = require('../../utils/transformers');
const {
  upsertFixture,
  upsertFixtureEvents,
  upsertFixtureStatistics,
} = require('../../models/fixtures.model');

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const LEAGUE_ID = parseInt(process.env.PREMIER_LEAGUE_ID || '39', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

const fetchAndSaveFixtureDetail = async (fixtureId) => {
  const [eventsRes, statsRes] = await Promise.all([
    withRateLimit(() =>
      apiClient.get('/fixtures/events', { params: { fixture: fixtureId } })
    ),
    withRateLimit(() =>
      apiClient.get('/fixtures/statistics', { params: { fixture: fixtureId } })
    ),
  ]);

  const events = (eventsRes.data.response || []).map(transformFixtureEvent);
  await upsertFixtureEvents(fixtureId, events);

  const statistics = (statsRes.data.response || []).flatMap((teamStats) =>
    (teamStats.statistics || []).map((stat) =>
      transformFixtureStat(stat, teamStats.team.id, teamStats.team.name)
    )
  );
  await upsertFixtureStatistics(fixtureId, statistics);
};

const fetchFixtures = async () => {
  const response = await withRateLimit(() =>
    apiClient.get('/fixtures', {
      params: { team: TEAM_ID, season: SEASON, league: LEAGUE_ID },
    })
  );

  const fixtures = response.data.response || [];

  for (const f of fixtures) {
    const fixture = transformFixture(f, SEASON, LEAGUE_ID);
    await upsertFixture(fixture);

    const isFinished = ['FT', 'AET', 'PEN'].includes(fixture.status_short);
    if (isFinished) {
      await fetchAndSaveFixtureDetail(fixture.id);
    }
  }

  return fixtures.length;
};

module.exports = { fetchFixtures };
