// Database row shapes (what comes out of MySQL queries)

export interface DbFixture {
  id: number;
  referee: string | null;
  date: Date;
  timestamp: number;
  venue_name: string | null;
  venue_city: string | null;
  status_long: string;
  status_short: string;
  status_elapsed: number | null;
  home_team_id: number;
  home_team_name: string;
  home_team_logo: string | null;
  away_team_id: number;
  away_team_name: string;
  away_team_logo: string | null;
  home_goals: number | null;
  away_goals: number | null;
  season: number;
  league_id: number;
  round: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface DbFixtureEvent {
  id?: number;
  fixture_id?: number;
  time_elapsed: number;
  time_extra: number | null;
  team_id: number;
  team_name: string;
  player_id: number | null;
  player_name: string | null;
  assist_id: number | null;
  assist_name: string | null;
  type: string;
  detail: string;
  comments: string | null;
}

export interface DbFixtureStat {
  id?: number;
  fixture_id?: number;
  team_id: number;
  team_name: string;
  stat_type: string;
  stat_value: string | null;
}

export interface DbStanding {
  id?: number;
  season: number;
  league_id: number;
  team_id: number;
  team_name: string;
  team_logo: string | null;
  rank: number;
  points: number;
  goals_diff: number;
  form: string | null;
  status: string | null;
  description: string | null;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals_for: number;
  goals_against: number;
  home_played: number;
  home_win: number;
  home_draw: number;
  home_lose: number;
  home_goals_for: number;
  home_goals_against: number;
  away_played: number;
  away_win: number;
  away_draw: number;
  away_lose: number;
  away_goals_for: number;
  away_goals_against: number;
  updated_at?: Date;
}

export interface DbPlayer {
  id: number;
  season: number;
  name: string;
  firstname: string | null;
  lastname: string | null;
  age: number | null;
  nationality: string | null;
  position: string | null;
  photo: string | null;
  team_id: number;
  appearances: number;
  lineups: number;
  minutes: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  shots_total: number;
  shots_on: number;
  passes_total: number;
  passes_accuracy: number | null;
  tackles_total: number;
  dribbles_success: number;
  rating: number | null;
  updated_at?: Date;
}

export interface DbTeamStats {
  id?: number;
  season: number;
  league_id: number;
  team_id: number;
  form: string | null;
  fixtures_played_home: number;
  fixtures_played_away: number;
  fixtures_wins_home: number;
  fixtures_wins_away: number;
  fixtures_draws_home: number;
  fixtures_draws_away: number;
  fixtures_loses_home: number;
  fixtures_loses_away: number;
  goals_for_total: number;
  goals_against_total: number;
  goals_for_avg_home: number | null;
  goals_for_avg_away: number | null;
  biggest_win_home: string | null;
  biggest_win_away: string | null;
  biggest_lose_home: string | null;
  biggest_lose_away: string | null;
  clean_sheet_home: number;
  clean_sheet_away: number;
  penalty_scored: number;
  penalty_missed: number;
  updated_at?: Date;
}

export interface DbApiUsage {
  id?: number;
  date: Date;
  request_count: number;
  last_updated: Date;
}

export interface DbTeamInfo {
  team_id: number;
  team_name: string;
  team_logo: string | null;
}
