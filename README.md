# Dashboard Analytics MUFC — API

Backend en Node.js + Express + MySQL que actúa como capa intermedia entre el frontend del Manchester United Analytics Dashboard y la API externa [API-Football](https://v3.football.api-sports.io).

## Descripción

Almacena y sirve datos de fixtures, standings, jugadores y estadísticas del equipo. Un cronjob consume la API externa de forma controlada (límite: 100 requests/día).

## Stack

- **Runtime:** Node.js 20
- **Framework:** Express
- **Base de datos:** MySQL
- **Scheduler:** node-cron
- **HTTP Client:** Axios

## Ramas

- `main` — producción estable
- `develop` — integración de features

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```
