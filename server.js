const express = require("express");
const cors = require("cors");
const { redisClient } = require("./db/redisClient.js");

//route imports
const scoreRoute = require("./routes/scores");
const leaderboardRoute = require("./routes/leaderboard");

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
//CORS middleware
app.use(cors());

// routes
app.use("/api/score", scoreRoute);
app.use("/api/leaderboard", leaderboardRoute);

async function startServer() {
  await redisClient.connect();
  console.log("Connected to Redis");

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Start the server
startServer();
