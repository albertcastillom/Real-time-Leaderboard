const { createClient } = require("redis");

function buildRedisConfig(env = process.env) {
  if (!env.REDIS_HOST) {
    return {
      url: env.REDIS_URL || "redis://localhost:6379",
    };
  }

  const port = Number(env.REDIS_PORT || 6379);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("REDIS_PORT must be a valid port number");
  }

  const hasUsername = Boolean(env.REDIS_USERNAME);
  const hasPassword = Boolean(env.REDIS_PASSWORD);
  if (hasUsername !== hasPassword) {
    throw new Error(
      "REDIS_USERNAME and REDIS_PASSWORD must be provided together",
    );
  }

  const config = {
    socket: {
      host: env.REDIS_HOST,
      port,
      tls: env.REDIS_TLS?.toLowerCase() === "true",
    },
  };

  if (hasUsername) {
    config.username = env.REDIS_USERNAME;
    config.password = env.REDIS_PASSWORD;
  }

  return config;
}

const redisClient = createClient(buildRedisConfig());

redisClient.on("error", (err) => console.error("Redis Client Error", err));

module.exports = { buildRedisConfig, redisClient };
