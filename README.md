# Real-Time Leaderboard

## Description

This project involves creating a backend system for a real-time leaderboard service. This system will later be modified and used in a screen time app.

Created using a static frontend page (HTML, CSS, JS). For the backend I created and express.js server linked to a redis database. Deployed on railway.

## Project URL

https://real-time-leaderboard-production.up.railway.app

Published Link: https://real-time-leaderboard-production.up.railway.app

## Run locally

Redis must be installed and available through `redis-server` and `redis-cli`.

```bash
npm install
npm run dev
```

`npm run dev` starts Redis in the background when needed, then serves the site at
`http://localhost:3000`. To stop the local Redis server, run `npm run redis:stop`.
