const express = require("express");
const cors = require("cors");
const { redisClient } = require("./db/redisClient.js");
const path = require("path");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

//route imports
const scoreRoute = require("./routes/scores");
const leaderboardRoute = require("./routes/leaderboard");
const healthRoute = require("./routes/health");

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware to parse JSON requests
app.use(express.json());
//CORS middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.set("io", io);

// routes
app.use("/api/score", scoreRoute);
app.use("/api/leaderboard", leaderboardRoute);
app.use("/api/health", healthRoute);

io.on("connection", (socket) => {
  console.log("Client Connected", socket.id);

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

async function startServer() {
  await redisClient.connect();
  console.log("Connected to Redis");

  server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

let isShuttingDown = false;

function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully.`);

  server.close(async () => {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
