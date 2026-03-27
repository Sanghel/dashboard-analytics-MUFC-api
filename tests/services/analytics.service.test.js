jest.mock('../../src/models/fixtures.model');
jest.mock('../../src/models/standings.model');
jest.mock('../../src/models/team.model');
jest.mock('../../src/models/apiUsage.model');

const { getRecentFixtures, getUpcomingFixtures } = require('../../src/models/fixtures.model');
const { getStandings } = require('../../src/models/standings.model');
const { getTeamStats } = require('../../src/models/team.model');
const { getTodayUsage } = require('../../src/models/apiUsage.model');
const { getOverview } = require('../../src/services/analytics.service');

const MUFC_ID = 33;

const makeFixture = (homeId, homeGoals, awayGoals) => ({
  home_team_id: homeId,
  away_team_id: homeId === MUFC_ID ? 42 : MUFC_ID,
  home_goals: homeGoals,
  away_goals: awayGoals,
});

describe('analytics.service — getOverview', () => {
  beforeEach(() => {
    process.env.MUFC_TEAM_ID = String(MUFC_ID);
    process.env.PREMIER_LEAGUE_ID = '39';
    process.env.CURRENT_SEASON = '2024';
    process.env.API_DAILY_LIMIT = '100';
    process.env.API_SAFETY_LIMIT = '95';

    getUpcomingFixtures.mockResolvedValue([]);
    getStandings.mockResolvedValue([{ team_id: MUFC_ID, rank: 8, points: 27 }]);
    getTeamStats.mockResolvedValue({ goals_for_total: 22 });
    getTodayUsage.mockResolvedValue({ request_count: 12 });
  });

  it('includes standing, upcoming and api_usage', async () => {
    getRecentFixtures.mockResolvedValue([]);
    const result = await getOverview();

    expect(result.standing).toEqual({ team_id: MUFC_ID, rank: 8, points: 27 });
    expect(result.upcoming_fixtures).toEqual([]);
    expect(result.api_usage.requests_today).toBe(12);
    expect(result.api_usage.daily_limit).toBe(100);
  });

  it('calculates form correctly from recent fixtures', async () => {
    // model returns newest→oldest (ORDER BY date DESC)
    // after .reverse() in service → oldest→newest: W, D, L, W, W
    getRecentFixtures.mockResolvedValue([
      makeFixture(MUFC_ID, 1, 0), // newest  → W (home)
      makeFixture(42, 0, 3),      //         → W (away)
      makeFixture(MUFC_ID, 0, 2), //         → L (home)
      makeFixture(42, 1, 1),      //         → D (away)
      makeFixture(MUFC_ID, 2, 0), // oldest  → W (home)
    ]);

    const result = await getOverview();
    expect(result.form).toEqual(['W', 'D', 'L', 'W', 'W']);
  });

  it('sets api_usage to null when no usage record exists', async () => {
    getRecentFixtures.mockResolvedValue([]);
    getTodayUsage.mockResolvedValue(null);
    const result = await getOverview();
    expect(result.api_usage).toBeNull();
  });
});
