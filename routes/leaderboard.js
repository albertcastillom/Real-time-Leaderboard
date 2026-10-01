const Router = require("express").Router();
const {
  getLeaderboard,
  getTopScores,
} = require("../controllers/leaderboardController.js");

// fetch leaaderboard data
Router.get("/", getLeaderboard);
Router.get("/top", getTopScores);

module.exports = Router;
