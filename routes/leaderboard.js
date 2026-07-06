const Router = require("express").Router();

// Sample route
Router.get("/", (req, res) => {
  // fetch from redis
  const leaderboardData = [
    { username: "user1", score: 100 },
    { username: "user2", score: 90 },
    { username: "user3", score: 80 },
  ];

  res.status(200).json(leaderboardData);
});

module.exports = Router;
