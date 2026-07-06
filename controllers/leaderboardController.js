const { redisClient } = require("../db/redisClient.js");

const getLeaderboard = async (req, res) => {
  try {
    const results = await redisClient.zRangeWithScores("leaderboard", 0, -1, {
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
    const results = await redisClient.zRangeWithScores("leaderboard", 0, 9, {
      REV: true,
    });
    res.json(results);
  } catch (error) {
    console.error("Error fetching top scores:", error);
    res.status(500).json({ message: "Error fetching top scores" });
  }
};

const deleteLeaderboard = async (req, res) => {
  try {
    await redisClient.del("leaderboard");
    res.json({ message: "Leaderboard deleted successfully" });
  } catch (error) {
    console.error("Error deleting leaderboard:", error);
    res.status(500).json({ message: "Error deleting leaderboard" });
  }
};

module.exports = { getLeaderboard, getTopScores, deleteLeaderboard };
