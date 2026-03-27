import {
  transformFixture,
  transformFixtureEvent,
  transformFixtureStat,
  transformStanding,
  transformPlayer,
  transformTeamStats,
} from '../../src/utils/transformers';

// ─── Fixtures de datos (shape real de API-Football v3) ───────────────────────

const apiFixture = {
  fixture: {
    id: 1035092,
    referee: 'M. Oliver',
    date: '2024-08-16T19:00:00+00:00',
    timestamp: 1723834800,
    venue: { name: 'Old Trafford', city: 'Manchester' },
    status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
  },
  league: { id: 39, round: 'Regular Season - 1' },
  teams: {
    home: { id: 33, name: 'Manchester United', logo: 'https://logo.com/mu.png' },
    away: { id: 42, name: 'Fulham', logo: 'https://logo.com/ful.png' },
  },
  goals: { home: 1, away: 0 },
};

const apiEvent = {
  time: { elapsed: 55, extra: null },
  team: { id: 33, name: 'Manchester United' },
  player: { id: 284060, name: 'B. Fernandes' },
  assist: { id: 165469, name: 'M. Mount' },
  type: 'Goal',
  detail: 'Normal Goal',
  comments: null,
};

const apiStat = { type: 'Ball Possession', value: '54%' };

const apiStanding = {
  team: { id: 33, name: 'Manchester United', logo: 'https://logo.com/mu.png' },
  rank: 8,
  points: 27,
  goalsDiff: 3,
  form: 'WLDWW',
  status: 'same',
  description: null,
  all: { played: 20, win: 8, draw: 3, lose: 9, goals: { for: 22, against: 19 } },
  home: { played: 10, win: 5, draw: 1, lose: 4, goals: { for: 12, against: 10 } },
  away: { played: 10, win: 3, draw: 2, lose: 5, goals: { for: 10, against: 9 } },
};

const apiPlayer = {
  player: {
    id: 284060,
    name: 'Bruno Fernandes',
    firstname: 'Bruno',
    lastname: 'Fernandes',
    age: 29,
    nationality: 'Portugal',
    photo: 'https://photo.com/bruno.png',
  },
  statistics: [
    {
      games: {
        appearences: 20,
        lineups: 19,
        minutes: 1720,
        position: 'Midfielder',
        rating: '7.25',
      },
      goals: { total: 5, assists: 8 },
      cards: { yellow: 3, red: 0 },
      shots: { total: 40, on: 18 },
      passes: { total: 850, accuracy: '87' },
      tackles: { total: 30 },
      dribbles: { success: 22 },
    },
  ],
};

const apiTeamStats = {
  form: 'WLDWWDW',
  fixtures: {
    played: { home: 10, away: 10 },
    wins: { home: 5, away: 4 },
    draws: { home: 2, away: 1 },
    loses: { home: 3, away: 5 },
  },
  goals: {
    for: {
      total: { total: 35 },
      average: { home: '1.8', away: '1.3' },
    },
    against: { total: { total: 28 } },
  },
  biggest: {
    wins: { home: '3-0', away: '4-1' },
    loses: { home: '0-2', away: '0-3' },
  },
  clean_sheet: { home: 4, away: 2 },
  penalty: { scored: { total: 3 }, missed: { total: 1 } },
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('transformFixture', () => {
  const result = transformFixture(apiFixture, 2024, 39);

  it('maps fixture id and basic fields', () => {
    expect(result.id).toBe(1035092);
    expect(result.referee).toBe('M. Oliver');
    expect(result.season).toBe(2024);
    expect(result.league_id).toBe(39);
    expect(result.round).toBe('Regular Season - 1');
  });

  it('maps venue fields', () => {
    expect(result.venue_name).toBe('Old Trafford');
    expect(result.venue_city).toBe('Manchester');
  });

  it('maps status fields', () => {
    expect(result.status_short).toBe('FT');
    expect(result.status_long).toBe('Match Finished');
    expect(result.status_elapsed).toBe(90);
  });

  it('maps home and away teams', () => {
    expect(result.home_team_id).toBe(33);
    expect(result.home_team_name).toBe('Manchester United');
    expect(result.away_team_id).toBe(42);
    expect(result.away_team_name).toBe('Fulham');
  });

  it('maps goals', () => {
    expect(result.home_goals).toBe(1);
    expect(result.away_goals).toBe(0);
  });

  it('converts date string to Date object', () => {
    expect(result.date).toBeInstanceOf(Date);
  });
});

describe('transformFixtureEvent', () => {
  const result = transformFixtureEvent(apiEvent);

  it('maps time and team', () => {
    expect(result.time_elapsed).toBe(55);
    expect(result.time_extra).toBeNull();
    expect(result.team_id).toBe(33);
    expect(result.team_name).toBe('Manchester United');
  });

  it('maps player and assist', () => {
    expect(result.player_id).toBe(284060);
    expect(result.player_name).toBe('B. Fernandes');
    expect(result.assist_id).toBe(165469);
    expect(result.assist_name).toBe('M. Mount');
  });

  it('maps type, detail and comments', () => {
    expect(result.type).toBe('Goal');
    expect(result.detail).toBe('Normal Goal');
    expect(result.comments).toBeNull();
  });
});

describe('transformFixtureStat', () => {
  it('maps stat fields with team info', () => {
    const result = transformFixtureStat(apiStat, 33, 'Manchester United');
    expect(result.team_id).toBe(33);
    expect(result.team_name).toBe('Manchester United');
    expect(result.stat_type).toBe('Ball Possession');
    expect(result.stat_value).toBe('54%');
  });

  it('converts null value to null string', () => {
    const result = transformFixtureStat({ type: 'Saves', value: null }, 33, 'Manchester United');
    expect(result.stat_value).toBeNull();
  });
});

describe('transformStanding', () => {
  const result = transformStanding(apiStanding, 2024, 39);

  it('maps team and season', () => {
    expect(result.team_id).toBe(33);
    expect(result.team_name).toBe('Manchester United');
    expect(result.season).toBe(2024);
    expect(result.league_id).toBe(39);
  });

  it('maps rank, points and diff', () => {
    expect(result.rank).toBe(8);
    expect(result.points).toBe(27);
    expect(result.goals_diff).toBe(3);
  });

  it('maps overall, home and away records', () => {
    expect(result.played).toBe(20);
    expect(result.win).toBe(8);
    expect(result.home_played).toBe(10);
    expect(result.away_lose).toBe(5);
    expect(result.goals_for).toBe(22);
    expect(result.away_goals_against).toBe(9);
  });
});

describe('transformPlayer', () => {
  const result = transformPlayer(apiPlayer, 2024, 33);

  it('maps player identity fields', () => {
    expect(result!.id).toBe(284060);
    expect(result!.name).toBe('Bruno Fernandes');
    expect(result!.nationality).toBe('Portugal');
    expect(result!.season).toBe(2024);
    expect(result!.team_id).toBe(33);
  });

  it('maps game stats', () => {
    expect(result!.appearances).toBe(20);
    expect(result!.minutes).toBe(1720);
    expect(result!.goals).toBe(5);
    expect(result!.assists).toBe(8);
  });

  it('converts string rating and accuracy to float', () => {
    expect(result!.rating).toBe(7.25);
    expect(result!.passes_accuracy).toBe(87);
  });

  it('maps card and shot stats', () => {
    expect(result!.yellow_cards).toBe(3);
    expect(result!.red_cards).toBe(0);
    expect(result!.shots_total).toBe(40);
    expect(result!.shots_on).toBe(18);
  });
});

describe('transformTeamStats', () => {
  const result = transformTeamStats(apiTeamStats, 2024, 39, 33);

  it('maps identity fields', () => {
    expect(result.season).toBe(2024);
    expect(result.league_id).toBe(39);
    expect(result.team_id).toBe(33);
    expect(result.form).toBe('WLDWWDW');
  });

  it('maps fixture counts', () => {
    expect(result.fixtures_played_home).toBe(10);
    expect(result.fixtures_wins_away).toBe(4);
    expect(result.fixtures_loses_home).toBe(3);
  });

  it('maps goal averages as floats', () => {
    expect(result.goals_for_avg_home).toBe(1.8);
    expect(result.goals_for_avg_away).toBe(1.3);
  });

  it('maps biggest results and clean sheets', () => {
    expect(result.biggest_win_home).toBe('3-0');
    expect(result.biggest_lose_away).toBe('0-3');
    expect(result.clean_sheet_home).toBe(4);
    expect(result.penalty_scored).toBe(3);
    expect(result.penalty_missed).toBe(1);
  });
});
