const Router = require("express").Router();
const { redisClient } = require("../db/redisClient.js");

// fetch leaaderboard data
Router.get("/", async (req, res) => {
  try {
    const results = await redisClient.zRangeWithScores("leaderboard", 0, -1, {
      REV: true,
    });
    res.json(results);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

module.exports = Router;
