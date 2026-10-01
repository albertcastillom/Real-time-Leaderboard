# Real-Time Leaderboard

## Description

This project involves creating a backend system for a real-time leaderboard service. This system will later be modified and used in a screen time app.

Created using a static frontend page (HTML, CSS, JS). The backend is an
Express.js server connected to Redis, with Socket.IO for real-time updates.

## Run locally

Redis must be installed and available through `redis-server` and `redis-cli`.

```bash
npm install
npm run dev
```

`npm run dev` starts Redis in the background when needed, then serves the site at
`http://localhost:3000`. To stop the local Redis server, run `npm run redis:stop`.

The application defaults to `redis://localhost:6379`, so a `.env` file is not
required for this local workflow. Copy `.env.example` to `.env` when you need to
override the port or Redis connection URL.

## Run with Docker

Docker Compose starts the application and Redis as separate containers:

```bash
npm run docker:up
```

Open `http://localhost:3000`. The health endpoint is available at
`http://localhost:3000/api/health`.

Stop the containers with:

```bash
npm run docker:down
```

Leaderboard data is stored in a named Docker volume and survives container
restarts. Run `docker compose down --volumes` only when you intentionally want
to remove that local data.

## Environment variables

- `PORT`: HTTP port used by the application. Defaults to `3000`.
- `REDIS_URL`: Redis connection URL. Defaults to `redis://localhost:6379`.

Compose sets `REDIS_URL=redis://redis:6379` because containers reach each other
by service name. In AWS, configure `REDIS_URL` on the ECS task definition using
the private ElastiCache endpoint. Runtime configuration should be injected by
ECS or AWS Secrets Manager rather than copied into the container image.
