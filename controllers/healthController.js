const { redisClient } = require("../db/redisClient.js");

const getHealth = async (req, res) => {
  try {
    await redisClient.ping();

    res.status(200).json({
      status: "ok",
      services: {
        api: "up",
        redis: "up",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: "unavailable",
      services: {
        api: "up",
        redis: "down",
      },
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = { getHealth };
