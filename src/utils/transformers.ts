/**
 * API-Football response → DB model format
 * All functions are pure (no side effects).
 */

import {
  ApiFootballFixture,
  ApiFootballFixtureEvent,
  ApiFootballFixtureStat,
  ApiFootballStanding,
  ApiFootballPlayerStats,
  ApiFootballTeamStats,
} from '../types/api-football';
import {
  DbFixture,
  DbFixtureEvent,
  DbFixtureStat,
  DbStanding,
  DbPlayer,
  DbTeamStats,
} from '../types/db';

export const transformFixture = (f: ApiFootballFixture, season: number, leagueId: number): DbFixture => ({
  id: f.fixture.id,
  referee: f.fixture.referee || null,
  date: new Date(f.fixture.date),
  timestamp: f.fixture.timestamp,
  venue_name: f.fixture.venue?.name || null,
  venue_city: f.fixture.venue?.city || null,
  status_long: f.fixture.status.long,
  status_short: f.fixture.status.short,
  status_elapsed: f.fixture.status.elapsed || null,
  home_team_id: f.teams.home.id,
  home_team_name: f.teams.home.name,
  home_team_logo: f.teams.home.logo || null,
  away_team_id: f.teams.away.id,
  away_team_name: f.teams.away.name,
  away_team_logo: f.teams.away.logo || null,
  home_goals: f.goals.home,
  away_goals: f.goals.away,
  season,
  league_id: leagueId,
  round: f.league?.round || null,
});

export const transformFixtureEvent = (e: ApiFootballFixtureEvent): DbFixtureEvent => ({
  time_elapsed: e.time.elapsed,
  time_extra: e.time.extra || null,
  team_id: e.team.id,
  team_name: e.team.name,
  player_id: e.player?.id || null,
  player_name: e.player?.name || null,
  assist_id: e.assist?.id || null,
  assist_name: e.assist?.name || null,
  type: e.type,
  detail: e.detail,
  comments: e.comments || null,
});

export const transformFixtureStat = (stat: ApiFootballFixtureStat, teamId: number, teamName: string): DbFixtureStat => ({
  team_id: teamId,
  team_name: teamName,
  stat_type: stat.type,
  stat_value: stat.value !== null ? String(stat.value) : null,
});

export const transformStanding = (s: ApiFootballStanding, season: number, leagueId: number): DbStanding => ({
  season,
  league_id: leagueId,
  team_id: s.team.id,
  team_name: s.team.name,
  team_logo: s.team.logo || null,
  rank: s.rank,
  points: s.points,
  goals_diff: s.goalsDiff,
  form: s.form || null,
  status: s.status || null,
  description: s.description || null,
  played: s.all.played,
  win: s.all.win,
  draw: s.all.draw,
  lose: s.all.lose,
  goals_for: s.all.goals.for,
  goals_against: s.all.goals.against,
  home_played: s.home.played,
  home_win: s.home.win,
  home_draw: s.home.draw,
  home_lose: s.home.lose,
  home_goals_for: s.home.goals.for,
  home_goals_against: s.home.goals.against,
  away_played: s.away.played,
  away_win: s.away.win,
  away_draw: s.away.draw,
  away_lose: s.away.lose,
  away_goals_for: s.away.goals.for,
  away_goals_against: s.away.goals.against,
});

export const transformPlayer = (p: ApiFootballPlayerStats, season: number, teamId: number): DbPlayer | null => {
  const stats: Partial<ApiFootballPlayerStats['statistics'][0]> = p.statistics[0] || {};
  return {
    id: p.player.id,
    name: p.player.name,
    firstname: p.player.firstname || null,
    lastname: p.player.lastname || null,
    age: p.player.age || null,
    nationality: p.player.nationality || null,
    position: stats.games?.position || null,
    photo: p.player.photo || null,
    season,
    team_id: teamId,
    appearances: stats.games?.appearences || 0,
    lineups: stats.games?.lineups || 0,
    minutes: stats.games?.minutes || 0,
    goals: stats.goals?.total || 0,
    assists: stats.goals?.assists || 0,
    yellow_cards: stats.cards?.yellow || 0,
    red_cards: stats.cards?.red || 0,
    shots_total: stats.shots?.total || 0,
    shots_on: stats.shots?.on || 0,
    passes_total: stats.passes?.total || 0,
    passes_accuracy: stats.passes?.accuracy
      ? parseFloat(stats.passes.accuracy)
      : null,
    tackles_total: stats.tackles?.total || 0,
    dribbles_success: stats.dribbles?.success || 0,
    rating: stats.games?.rating ? parseFloat(stats.games.rating) : null,
  };
};

export const transformTeamStats = (s: ApiFootballTeamStats, season: number, leagueId: number, teamId: number): DbTeamStats => ({
  season,
  league_id: leagueId,
  team_id: teamId,
  form: s.form || null,
  fixtures_played_home: s.fixtures?.played?.home || 0,
  fixtures_played_away: s.fixtures?.played?.away || 0,
  fixtures_wins_home: s.fixtures?.wins?.home || 0,
  fixtures_wins_away: s.fixtures?.wins?.away || 0,
  fixtures_draws_home: s.fixtures?.draws?.home || 0,
  fixtures_draws_away: s.fixtures?.draws?.away || 0,
  fixtures_loses_home: s.fixtures?.loses?.home || 0,
  fixtures_loses_away: s.fixtures?.loses?.away || 0,
  goals_for_total: s.goals?.for?.total?.total || 0,
  goals_against_total: s.goals?.against?.total?.total || 0,
  goals_for_avg_home: s.goals?.for?.average?.home
    ? parseFloat(s.goals.for.average.home)
    : null,
  goals_for_avg_away: s.goals?.for?.average?.away
    ? parseFloat(s.goals.for.average.away)
    : null,
  biggest_win_home: s.biggest?.wins?.home || null,
  biggest_win_away: s.biggest?.wins?.away || null,
  biggest_lose_home: s.biggest?.loses?.home || null,
  biggest_lose_away: s.biggest?.loses?.away || null,
  clean_sheet_home: s.clean_sheet?.home || 0,
  clean_sheet_away: s.clean_sheet?.away || 0,
  penalty_scored: s.penalty?.scored?.total || 0,
  penalty_missed: s.penalty?.missed?.total || 0,
});
