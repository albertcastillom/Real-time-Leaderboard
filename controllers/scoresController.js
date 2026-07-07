const { redisClient } = require("../db/redisClient.js");

const addScore = async (req, res) => {
  try {
    const username = req.body.username;
    const score = req.body.score;

    if (!username || score === undefined) {
      return res
        .status(400)
        .json({ message: "Username and score are required" });
    }
    // Validate that score is a number
    if (isNaN(score)) {
      return res.status(400).json({ message: "Score must be a number" });
    }

    // save to redis, but only if its a higher score than the previous one
    const previousScore = await redisClient.zScore("leaderboard", username);
    if (previousScore !== null && score >= previousScore) {
      return res.status(200).json({
        message: "Score not saved. Previous score is lower or equal.",
        username,
        score: previousScore,
      });
    }

    await redisClient.zAdd("leaderboard", {
      score: score,
      value: username,
    });

    const leaderboard = await redisClient.zRangeWithScores("leaderboard", 0, 9);

    const io = req.app.get("io");
    io.emit("leaderboard:update", leaderboard);

    res.status(200).json({
      message: "Score saved successfully",
      username,
      score: score,
    });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ message: "Error saving score" });
  }
};

module.exports = { addScore };
