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

    // save to redis, but only if its a higher score than the previous one
    const previousScore = await redisClient.zScore("leaderboard", username);
    if (previousScore !== null && Number(score) <= Number(previousScore)) {
      return res.status(200).json({
        message: "Score not saved. Previous score is higher or equal.",
        username,
        score: Number(previousScore),
      });
    }

    await redisClient.zAdd("leaderboard", {
      score: score,
      value: username,
    });

    res.status(200).json({
      message: "Score saved successfully",
      username,
      score: Number(score),
    });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ message: "Error saving score" });
  }
};

module.exports = { addScore };
