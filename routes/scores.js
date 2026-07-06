const router = require("express").Router();

const { addScore } = require("../controllers/scoresController.js");

// Sample route
router.post("/", addScore);

module.exports = router;
