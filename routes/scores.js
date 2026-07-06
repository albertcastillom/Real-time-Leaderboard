const router = require("express").Router();
const { redisClient } = require("../db/redisClient.js");

// Sample route
router.post("/", async (req, res) => {
  try {
    const username = req.body.username;
    const score = req.body.score;

    if (!username || score === undefined) {
      return res
        .status(400)
        .json({ message: "Username and score are required" });
    }

    // save to redis
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
});

module.exports = router;
