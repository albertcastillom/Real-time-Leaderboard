const { redisClient } = require("../db/redisClient.js");

const getLeaderboard = async (req, res) => {
  try {
    const difficulty = req.query.difficulty;
    const validDifficulties = ["easy", "medium", "hard"];

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: "Invalid or missing difficulty",
      });
    }
    const leaderboardKey = `leaderboard:${difficulty}`;

    const results = await redisClient.zRangeWithScores(leaderboardKey, 0, -1, {
      REV: true,
    });
    res.json(results);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

const getTopScores = async (req, res) => {
  try {
    const difficulty = req.query.difficulty;
    const validDifficulties = ["easy", "medium", "hard"];

    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: "Invalid or missing difficulty",
      });
    }
    const leaderboardKey = `leaderboard:${difficulty}`;

    const results = await redisClient.zRangeWithScores(leaderboardKey, 0, 9, {
      REV: true,
    });
    res.json(results);
  } catch (error) {
    console.error("Error fetching top scores:", error);
    res.status(500).json({ message: "Error fetching top scores" });
  }
};

module.exports = {
  getLeaderboard,
  getTopScores,
};
