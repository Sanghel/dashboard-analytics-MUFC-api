// API-Football v3 response shapes

export interface ApiFootballFixture {
  fixture: {
    id: number;
    referee: string | null;
    date: string;
    timestamp: number;
    venue: { name: string | null; city: string | null } | null;
    status: { long: string; short: string; elapsed: number | null };
  };
  league: { id: number; round: string | null };
  teams: {
    home: { id: number; name: string; logo: string | null };
    away: { id: number; name: string; logo: string | null };
  };
  goals: { home: number | null; away: number | null };
}

export interface ApiFootballFixtureEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo?: string };
  player: { id: number | null; name: string | null } | null;
  assist: { id: number | null; name: string | null } | null;
  type: string;
  detail: string;
  comments: string | null;
}

export interface ApiFootballFixtureStat {
  type: string;
  value: string | number | boolean | null;
}

export interface ApiFootballFixtureStatTeam {
  team: { id: number; name: string; logo: string };
  statistics: ApiFootballFixtureStat[];
}

export interface ApiFootballStanding {
  team: { id: number; name: string; logo: string | null };
  rank: number;
  points: number;
  goalsDiff: number;
  form: string | null;
  status: string | null;
  description: string | null;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  home: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
  away: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

export interface ApiFootballPlayerStats {
  player: {
    id: number;
    name: string;
    firstname: string | null;
    lastname: string | null;
    age: number | null;
    nationality: string | null;
    photo: string | null;
  };
  statistics: Array<{
    games: {
      appearences: number;
      lineups: number;
      minutes: number;
      position: string | null;
      rating: string | null;
    };
    goals: { total: number | null; assists: number | null };
    cards: { yellow: number; red: number };
    shots: { total: number | null; on: number | null };
    passes: { total: number | null; accuracy: string | null };
    tackles: { total: number | null };
    dribbles: { success: number | null };
  }>;
}

export interface ApiFootballTeamStats {
  form: string | null;
  fixtures: {
    played: { home: number; away: number };
    wins: { home: number; away: number };
    draws: { home: number; away: number };
    loses: { home: number; away: number };
  };
  goals: {
    for: {
      total: { total: number };
      average: { home: string | null; away: string | null };
    };
    against: { total: { total: number } };
  };
  biggest: {
    wins: { home: string | null; away: string | null };
    loses: { home: string | null; away: string | null };
  };
  clean_sheet: { home: number; away: number };
  penalty: {
    scored: { total: number };
    missed: { total: number };
  };
}

export interface ApiFootballPaging {
  current: number;
  total: number;
}

export interface ApiFootballResponse<T> {
  response: T[];
  paging?: ApiFootballPaging;
  errors?: unknown;
}
