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

// Start the server
startServer();
