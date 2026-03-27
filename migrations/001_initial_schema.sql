-- ============================================================
-- MUFC Analytics API — Initial Schema
-- ============================================================

-- ------------------------------------------------------------
-- fixtures
-- Partidos de MUFC: pasados, en curso y próximos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fixtures (
  id              INT          NOT NULL,   -- ID de API-Football
  referee         VARCHAR(100),
  date            DATETIME     NOT NULL,
  timestamp       INT          NOT NULL,
  venue_name      VARCHAR(100),
  venue_city      VARCHAR(100),
  status_long     VARCHAR(50)  NOT NULL,
  status_short    VARCHAR(10)  NOT NULL,
  status_elapsed  INT,
  home_team_id    INT          NOT NULL,
  home_team_name  VARCHAR(100) NOT NULL,
  home_team_logo  VARCHAR(255),
  away_team_id    INT          NOT NULL,
  away_team_name  VARCHAR(100) NOT NULL,
  away_team_logo  VARCHAR(255),
  home_goals      INT,
  away_goals      INT,
  season          INT          NOT NULL,
  league_id       INT          NOT NULL,
  round           VARCHAR(50),
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_season_league (season, league_id),
  INDEX idx_date (date),
  INDEX idx_status_short (status_short)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- fixture_events
-- Eventos de un partido: goles, tarjetas, sustituciones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fixture_events (
  id             INT         NOT NULL AUTO_INCREMENT,
  fixture_id     INT         NOT NULL,
  time_elapsed   INT         NOT NULL,
  time_extra     INT,
  team_id        INT         NOT NULL,
  team_name      VARCHAR(100) NOT NULL,
  player_id      INT,
  player_name    VARCHAR(100),
  assist_id      INT,
  assist_name    VARCHAR(100),
  type           VARCHAR(20)  NOT NULL,   -- Goal, Card, Subst, Var
  detail         VARCHAR(50)  NOT NULL,
  comments       VARCHAR(255),
  PRIMARY KEY (id),
  INDEX idx_fixture (fixture_id),
  CONSTRAINT fk_events_fixture FOREIGN KEY (fixture_id) REFERENCES fixtures (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- fixture_statistics
-- Estadísticas por equipo para un partido dado
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fixture_statistics (
  id          INT          NOT NULL AUTO_INCREMENT,
  fixture_id  INT          NOT NULL,
  team_id     INT          NOT NULL,
  team_name   VARCHAR(100) NOT NULL,
  stat_type   VARCHAR(50)  NOT NULL,
  stat_value  VARCHAR(20),
  PRIMARY KEY (id),
  INDEX idx_fixture_team (fixture_id, team_id),
  CONSTRAINT fk_stats_fixture FOREIGN KEY (fixture_id) REFERENCES fixtures (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- standings
-- Tabla de posiciones de la Premier League por temporada
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS standings (
  id                  INT          NOT NULL AUTO_INCREMENT,
  season              INT          NOT NULL,
  league_id           INT          NOT NULL,
  team_id             INT          NOT NULL,
  team_name           VARCHAR(100) NOT NULL,
  team_logo           VARCHAR(255),
  rank                INT          NOT NULL,
  points              INT          NOT NULL,
  goals_diff          INT          NOT NULL,
  form                VARCHAR(10),
  status              VARCHAR(20),
  description         VARCHAR(100),
  played              INT          NOT NULL DEFAULT 0,
  win                 INT          NOT NULL DEFAULT 0,
  draw                INT          NOT NULL DEFAULT 0,
  lose                INT          NOT NULL DEFAULT 0,
  goals_for           INT          NOT NULL DEFAULT 0,
  goals_against       INT          NOT NULL DEFAULT 0,
  home_played         INT          NOT NULL DEFAULT 0,
  home_win            INT          NOT NULL DEFAULT 0,
  home_draw           INT          NOT NULL DEFAULT 0,
  home_lose           INT          NOT NULL DEFAULT 0,
  home_goals_for      INT          NOT NULL DEFAULT 0,
  home_goals_against  INT          NOT NULL DEFAULT 0,
  away_played         INT          NOT NULL DEFAULT 0,
  away_win            INT          NOT NULL DEFAULT 0,
  away_draw           INT          NOT NULL DEFAULT 0,
  away_lose           INT          NOT NULL DEFAULT 0,
  away_goals_for      INT          NOT NULL DEFAULT 0,
  away_goals_against  INT          NOT NULL DEFAULT 0,
  updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_season_league_team (season, league_id, team_id),
  INDEX idx_season_league (season, league_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- players
-- Estadísticas de jugadores de MUFC por temporada
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS players (
  id                INT            NOT NULL,   -- ID de API-Football
  name              VARCHAR(100)   NOT NULL,
  firstname         VARCHAR(100),
  lastname          VARCHAR(100),
  age               INT,
  nationality       VARCHAR(50),
  position          VARCHAR(20),
  photo             VARCHAR(255),
  season            INT            NOT NULL,
  team_id           INT            NOT NULL,
  appearances       INT            NOT NULL DEFAULT 0,
  lineups           INT            NOT NULL DEFAULT 0,
  minutes           INT            NOT NULL DEFAULT 0,
  goals             INT            NOT NULL DEFAULT 0,
  assists           INT            NOT NULL DEFAULT 0,
  yellow_cards      INT            NOT NULL DEFAULT 0,
  red_cards         INT            NOT NULL DEFAULT 0,
  shots_total       INT            NOT NULL DEFAULT 0,
  shots_on          INT            NOT NULL DEFAULT 0,
  passes_total      INT            NOT NULL DEFAULT 0,
  passes_accuracy   DECIMAL(5, 2),
  tackles_total     INT            NOT NULL DEFAULT 0,
  dribbles_success  INT            NOT NULL DEFAULT 0,
  rating            DECIMAL(4, 2),
  updated_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id, season),
  INDEX idx_team_season (team_id, season)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- team_stats
-- Estadísticas globales del equipo por temporada y liga
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_stats (
  id                    INT            NOT NULL AUTO_INCREMENT,
  season                INT            NOT NULL,
  league_id             INT            NOT NULL,
  team_id               INT            NOT NULL,
  form                  VARCHAR(20),
  fixtures_played_home  INT            NOT NULL DEFAULT 0,
  fixtures_played_away  INT            NOT NULL DEFAULT 0,
  fixtures_wins_home    INT            NOT NULL DEFAULT 0,
  fixtures_wins_away    INT            NOT NULL DEFAULT 0,
  fixtures_draws_home   INT            NOT NULL DEFAULT 0,
  fixtures_draws_away   INT            NOT NULL DEFAULT 0,
  fixtures_loses_home   INT            NOT NULL DEFAULT 0,
  fixtures_loses_away   INT            NOT NULL DEFAULT 0,
  goals_for_total       INT            NOT NULL DEFAULT 0,
  goals_against_total   INT            NOT NULL DEFAULT 0,
  goals_for_avg_home    DECIMAL(4, 2),
  goals_for_avg_away    DECIMAL(4, 2),
  biggest_win_home      VARCHAR(10),
  biggest_win_away      VARCHAR(10),
  biggest_lose_home     VARCHAR(10),
  biggest_lose_away     VARCHAR(10),
  clean_sheet_home      INT            NOT NULL DEFAULT 0,
  clean_sheet_away      INT            NOT NULL DEFAULT 0,
  penalty_scored        INT            NOT NULL DEFAULT 0,
  penalty_missed        INT            NOT NULL DEFAULT 0,
  updated_at            DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_season_league_team (season, league_id, team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- api_usage
-- Contador de requests diarios a API-Football
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_usage (
  id             INT      NOT NULL AUTO_INCREMENT,
  date           DATE     NOT NULL,
  request_count  INT      NOT NULL DEFAULT 0,
  last_updated   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
