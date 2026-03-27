jest.mock('../../src/models/fixtures.model');

import {
  getFixturesBySeason,
  getRecentFixtures,
  getUpcomingFixtures,
  getFixtureById,
  getFixtureEvents,
  getFixtureStatistics,
} from '../../src/models/fixtures.model';

import {
  getFixtures,
  getRecent,
  getUpcoming,
  getFixtureDetail,
} from '../../src/services/fixtures.service';

const mockFixture = { id: 1, status_short: 'FT', home_goals: 2, away_goals: 1 };
const mockEvents = [{ type: 'Goal' }];
const mockStats = [{ stat_type: 'Ball Possession', stat_value: '54%' }];

describe('fixtures.service', () => {
  beforeEach(() => {
    process.env.MUFC_TEAM_ID = '33';
    process.env.CURRENT_SEASON = '2024';
  });

  describe('getFixtures', () => {
    it('calls getFixturesBySeason with default season', async () => {
      (getFixturesBySeason as jest.Mock).mockResolvedValue([mockFixture]);
      const result = await getFixtures();
      expect(getFixturesBySeason).toHaveBeenCalledWith(33, 2024);
      expect(result).toEqual([mockFixture]);
    });

    it('forwards a custom season', async () => {
      (getFixturesBySeason as jest.Mock).mockResolvedValue([]);
      await getFixtures({ season: 2023 });
      expect(getFixturesBySeason).toHaveBeenCalledWith(33, 2023);
    });
  });

  describe('getRecent', () => {
    it('calls getRecentFixtures with default limit', async () => {
      (getRecentFixtures as jest.Mock).mockResolvedValue([mockFixture]);
      await getRecent();
      expect(getRecentFixtures).toHaveBeenCalledWith(33, 2024, 10);
    });

    it('forwards a custom limit', async () => {
      (getRecentFixtures as jest.Mock).mockResolvedValue([]);
      await getRecent({ limit: 5 });
      expect(getRecentFixtures).toHaveBeenCalledWith(33, 2024, 5);
    });
  });

  describe('getUpcoming', () => {
    it('calls getUpcomingFixtures with default limit', async () => {
      (getUpcomingFixtures as jest.Mock).mockResolvedValue([]);
      await getUpcoming();
      expect(getUpcomingFixtures).toHaveBeenCalledWith(33, 2024, 5);
    });
  });

  describe('getFixtureDetail', () => {
    it('returns null when fixture does not exist', async () => {
      (getFixtureById as jest.Mock).mockResolvedValue(null);
      const result = await getFixtureDetail(999);
      expect(result).toBeNull();
      expect(getFixtureEvents).not.toHaveBeenCalled();
    });

    it('returns fixture with events and statistics in parallel', async () => {
      (getFixtureById as jest.Mock).mockResolvedValue(mockFixture);
      (getFixtureEvents as jest.Mock).mockResolvedValue(mockEvents);
      (getFixtureStatistics as jest.Mock).mockResolvedValue(mockStats);

      const result = await getFixtureDetail(1);

      expect(result).toEqual({ fixture: mockFixture, events: mockEvents, statistics: mockStats });
      expect(getFixtureEvents).toHaveBeenCalledWith(1);
      expect(getFixtureStatistics).toHaveBeenCalledWith(1);
    });
  });
});
