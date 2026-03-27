# Dashboard Analytics MUFC — API

Backend en Node.js + Express + MySQL que actúa como capa intermedia entre el frontend del Manchester United Analytics Dashboard y la API externa [API-Football v3](https://v3.football.api-sports.io).

Almacena los datos localmente en MySQL y los sirve al frontend. Un cronjob consume la API externa de forma controlada, respetando el límite de **100 requests/día**.

---

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Base de datos | MySQL 8 |
| Scheduler | node-cron |
| HTTP Client | Axios |
| Testing | Jest + Supertest |

---

## Setup

### 1. Clonar y configurar entorno

```bash
git clone https://github.com/Sanghel/dashboard-analytics-MUFC-api.git
cd dashboard-analytics-MUFC-api
npm install
cp .env.example .env
# Editar .env con tus valores reales
```

### 2. Crear la base de datos

```sql
CREATE DATABASE mufc_analytics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Ejecutar migración

```bash
npm run migrate
```

### 4. Iniciar el servidor

```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

---

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno (`development` / `production`) | `development` |
| `DB_HOST` | Host de MySQL | — |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `DB_USER` | Usuario de MySQL | — |
| `DB_PASSWORD` | Contraseña de MySQL | — |
| `DB_NAME` | Nombre de la base de datos | — |
| `API_KEY` | API key de API-Football | — |
| `API_BASE_URL` | Base URL de la API | `https://v3.football.api-sports.io` |
| `API_DAILY_LIMIT` | Límite total diario | `100` |
| `API_SAFETY_LIMIT` | Límite de seguridad (se detiene aquí) | `95` |
| `MUFC_TEAM_ID` | ID de Manchester United en API-Football | `33` |
| `PREMIER_LEAGUE_ID` | ID de la Premier League | `39` |
| `CURRENT_SEASON` | Temporada activa | `2024` |

---

## API Reference

Todos los endpoints responden en formato estándar:

```json
{
  "success": true,
  "data": {},
  "meta": { "total": 20 }
}
```

En caso de error:

```json
{
  "success": false,
  "error": { "message": "Fixture not found" }
}
```

---

### Health

#### `GET /api/health`

Verifica que el servidor está activo.

```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "environment": "development"
}
```

---

### Fixtures

#### `GET /api/fixtures`

Todos los partidos de MUFC en el season actual.

**Query params:**

| Param | Tipo | Descripción |
|---|---|---|
| `season` | number | Temporada (default: `CURRENT_SEASON`) |

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1035092,
      "date": "2024-08-16T19:00:00.000Z",
      "status_short": "FT",
      "home_team_name": "Manchester United",
      "away_team_name": "Fulham",
      "home_goals": 1,
      "away_goals": 0
    }
  ],
  "meta": { "total": 38 }
}
```

---

#### `GET /api/fixtures/recent`

Últimos partidos terminados.

**Query params:**

| Param | Tipo | Descripción |
|---|---|---|
| `limit` | number | Cantidad de partidos (default: `10`) |
| `season` | number | Temporada |

---

#### `GET /api/fixtures/upcoming`

Próximos partidos programados.

**Query params:**

| Param | Tipo | Descripción |
|---|---|---|
| `limit` | number | Cantidad (default: `5`) |
| `season` | number | Temporada |

---

#### `GET /api/fixtures/:id`

Detalle completo de un partido: fixture + eventos + estadísticas.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "fixture": { "id": 1035092, "status_short": "FT", ... },
    "events": [
      {
        "time_elapsed": 55,
        "type": "Goal",
        "detail": "Normal Goal",
        "player_name": "B. Fernandes",
        "team_name": "Manchester United"
      }
    ],
    "statistics": [
      { "team_id": 33, "stat_type": "Ball Possession", "stat_value": "54%" }
    ]
  }
}
```

**Errores:** `404` si el fixture no existe en la DB.

---

### Standings

#### `GET /api/standings`

Tabla de posiciones de la Premier League.

**Query params:**

| Param | Tipo | Descripción |
|---|---|---|
| `season` | number | Temporada |
| `leagueId` | number | Liga (default: `PREMIER_LEAGUE_ID`) |

---

### Players

#### `GET /api/players`

Jugadores de MUFC con estadísticas de la temporada.

**Query params:**

| Param | Tipo | Descripción |
|---|---|---|
| `season` | number | Temporada |

---

#### `GET /api/players/:id`

Estadísticas de un jugador individual.

**Query params:**

| Param | Tipo | Descripción |
|---|---|---|
| `season` | number | Temporada |

**Errores:** `404` si el jugador no existe.

---

### Team

#### `GET /api/team/stats`

Estadísticas globales de MUFC: partidos, goles, form, penalties, clean sheets.

**Query params:**

| Param | Tipo | Descripción |
|---|---|---|
| `season` | number | Temporada |
| `leagueId` | number | Liga |

**Errores:** `404` si no hay datos para el season/liga solicitados.

---

### Analytics

#### `GET /api/analytics/overview`

Datos agregados para la página Overview del dashboard. Combina standings, form, fixtures recientes y próximos, team stats y uso de la API del día.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "season": 2024,
    "standing": { "rank": 8, "points": 27, "played": 20 },
    "form": ["W", "D", "L", "W", "W"],
    "recent_fixtures": [...],
    "upcoming_fixtures": [...],
    "team_stats": { "goals_for_total": 22, "form": "WLDWW" },
    "api_usage": {
      "requests_today": 12,
      "daily_limit": 100,
      "safety_limit": 95
    }
  }
}
```

---

## Cron Jobs

Los fetchers se ejecutan automáticamente según este schedule:

| Job | Schedule | Descripción |
|---|---|---|
| `fetchFixtures` | Cada 4 horas | Partidos + eventos + estadísticas |
| `fetchStandings` | Diario 06:00 UTC | Tabla de posiciones |
| `fetchPlayerStats` | Diario 06:30 UTC | Estadísticas de jugadores |
| `fetchTeamStats` | Diario 07:00 UTC | Estadísticas del equipo |

El guard `withRateLimit` verifica el contador en `api_usage` antes de cada request y lanza un error descriptivo si se alcanzó el `API_SAFETY_LIMIT`.

---

## Arquitectura

```
src/
├── app.js                 # Express app (sin side effects — testeable)
├── index.js               # Entry point: validateEnv + DB + crons + listen
├── config/
│   ├── db.js              # Pool de conexiones MySQL
│   └── env.js             # Validación de variables requeridas
├── routes/                # Express routers
├── controllers/           # Manejo de req/res
├── services/              # Lógica de negocio
├── models/                # Queries a MySQL
├── jobs/
│   ├── index.js           # Registro de crons
│   └── fetchers/          # Fetch + transform + persist
├── utils/
│   ├── apiClient.js       # Axios instance (API-Football)
│   ├── rateLimitGuard.js  # withRateLimit(fn)
│   └── transformers.js    # API response → DB format
└── middlewares/
    └── errorHandler.js    # Error handler global
```

---

## Testing

```bash
npm test                # Suite completo
npm run test:watch      # Watch mode
npm run test:coverage   # Con reporte de cobertura
```

**55 tests** en 3 categorías:
- `tests/unit/` — transformers y rateLimitGuard (funciones puras)
- `tests/services/` — services con models mockeados
- `tests/routes/` — integración HTTP con Supertest

---

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor con hot-reload (nodemon) |
| `npm start` | Servidor en producción |
| `npm test` | Ejecutar tests |
| `npm run migrate` | Crear/actualizar tablas en la DB |
| `npm run lint` | Verificar estilo de código |
| `npm run lint:fix` | Corregir estilo automáticamente |
