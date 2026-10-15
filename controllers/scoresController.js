const { redisClient } = require("../db/redisClient.js");

const addScore = async (req, res) => {
  try {
    const username = req.body.username;
    const score = req.body.score;
    const difficulty = req.body.difficulty;

    if (!username || score === undefined) {
      return res
        .status(400)
        .json({ message: "Username and score are required" });
    }
    // Validate that score is a number
    if (isNaN(score)) {
      return res.status(400).json({ message: "Score must be a number" });
    }

    //validate difficulty
    const validDiff = ["easy", "medium", "hard"];
    if (!validDiff.includes(difficulty)) {
      return res.status(400).json({
        message: "Invalid Difficulty",
      });
    }

    //construct leaderboard key
    const leaderboardKey = `leaderboard:${difficulty}`;

    // Save only a player's highest target count.
    const previousScore = await redisClient.zScore(leaderboardKey, username);
    if (previousScore !== null && score <= previousScore) {
      return res.status(200).json({
        message: "Score not saved. Previous score is higher or equal.",
        username,
        score: previousScore,
      });
    }

    await redisClient.zAdd(leaderboardKey, {
      score: score,
      value: username,
    });

    const leaderboard = await redisClient.zRangeWithScores(
      leaderboardKey,
      0,
      9,
      {
        REV: true,
      },
    );

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
