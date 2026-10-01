const router = require("express").Router();

const { getHealth } = require("../controllers/healthController.js");

router.get("/", getHealth);

module.exports = router;
