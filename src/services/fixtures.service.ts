import {
  getFixtureById,
  getFixtureEvents,
  getFixtureStatistics,
  getRecentFixtures,
  getUpcomingFixtures,
  getFixturesBySeason,
} from '../models/fixtures.model';
import { DbFixture, DbFixtureEvent, DbFixtureStat } from '../types/db';

const TEAM_ID = parseInt(process.env.MUFC_TEAM_ID || '33', 10);
const SEASON = parseInt(process.env.CURRENT_SEASON || '2024', 10);

export const getFixtures = async ({ season = SEASON } = {}): Promise<DbFixture[]> => {
  return getFixturesBySeason(TEAM_ID, season);
};

export const getRecent = async ({ limit = 10, season = SEASON } = {}): Promise<DbFixture[]> => {
  return getRecentFixtures(TEAM_ID, season, limit);
};

export const getUpcoming = async ({ limit = 5, season = SEASON } = {}): Promise<DbFixture[]> => {
  return getUpcomingFixtures(TEAM_ID, season, limit);
};

export const getFixtureDetail = async (id: number): Promise<{ fixture: DbFixture; events: DbFixtureEvent[]; statistics: DbFixtureStat[] } | null> => {
  const fixture = await getFixtureById(id);
  if (!fixture) return null;

  const [events, statistics] = await Promise.all([
    getFixtureEvents(id),
    getFixtureStatistics(id),
  ]);

  return { fixture, events, statistics };
};
