const express = require("express");
const scoreRoute = require("./routes/scores");
const leaderboardRoute = require("./routes/leaderboard");

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Sample route
app.use("/api/score", scoreRoute);
app.use("/api/leaderboard", leaderboardRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
