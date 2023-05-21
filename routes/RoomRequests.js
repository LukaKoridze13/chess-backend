import express from "express";
import { Server } from "socket.io";

const router = express.Router();
const io = new Server();

const players = {};

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    players[userId] = socket.id;
    socket.join("chess-room");
  });

  socket.on("chess-move", (move) => {
    socket.to("chess-room").emit("chess-move", move);
  });

  socket.on("disconnect", () => {
    const disconnectedPlayer = Object.keys(players).find(
      (userId) => players[userId] === socket.id
    );
    delete players[disconnectedPlayer];
  });
});

// Export the router
export default router;
