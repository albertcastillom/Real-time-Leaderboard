const router = require("express").Router();

// Sample route
router.post("/", (req, res) => {
  const username = req.body.username;
  const score = req.body.score;

  // save to redis

  res.status(200).json({ message: "Score saved successfully" });
});

module.exports = router;
