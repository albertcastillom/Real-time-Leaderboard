const Router = require("express").Router();
const {
  getLeaderboard,
  getTopScores,
  deleteLeaderboard,
} = require("../controllers/leaderboardController.js");

// fetch leaaderboard data
Router.get("/", getLeaderboard);
Router.get("/top", getTopScores);
Router.delete("/", deleteLeaderboard);

module.exports = Router;
