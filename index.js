import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import AccountRequests from "./routes/AccountRequests.js";
import RoomRequests from "./routes/RoomRequests.js";
import { Server as SocketIOServer } from "socket.io";

const app = express();
const PORT = process.env.PORT || 3500;
let io;
// Middleware configuration
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
// Routes
app.use("/api/accounts", AccountRequests);
app.use("/api/rooms", RoomRequests);

let usersOnline = 0;

await mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Successfully connected to MongoDB");

  let server = app.listen(PORT, () => {
    console.log("Server is running successfully");
  });

  io = new SocketIOServer(server, { cors: "*" });

  io.on("connect", (socket) => {
    usersOnline++;
    io.emit("online", usersOnline);
  
    socket.on("disconnect", () => {
      usersOnline--;
      io.emit("online", usersOnline);
    });

    socket.on('joinRoom',(roomID)=>{
      socket.join(roomID)
    })
  });

  app.locals.io = io;
});

