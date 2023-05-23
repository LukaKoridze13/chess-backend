import express from "express";
import Room from "../schemas/Room.js";
const app = express.Router();

app.post("/create", (req, res) => {
  let { username } = req.body;

  // Check if username is provided
  if (!username) {
    return res.status(400).send({ error: "Username is required" });
  }

  let user1 = {
    username,
    color: getRandomColor(),
  };

  let room_id = generateRoomId();

  let newRoom = new Room({ room_id, user1 });

  newRoom.save().then(() => {
    res.status(200).send({ message: "Room Created!", room_id });
  });
});

app.post("/join", async (req, res) => {
  let { username, room_id } = req.body;

  // Check if username is provided
  if (!username) {
    return res.status(400).send({ error: "Username is required" });
  }

  // Check if room ID is provided
  if (!room_id) {
    return res.status(400).send({ error: "Room ID is required" });
  }

  // Find the room with the provided room ID
  try {
    // Find the room with the provided room ID
    let room = await Room.findOne({ room_id });

    // If room not found, return error
    if (!room) {
      return res.status(404).send({ error: "Room not found" });
    }
    // If room already has both players, return error
    if (room.user1 && room.user2.username) {
      return res.status(400).send({ error: "Room is already full" });
    }

    let color = room.user1.color === "black" ? "white" : "black";

    // Join the user to the room
    const user2 = {
      username,
      color: color,
    };

    room.user2 = user2;
    await room.save();

    const io = req.app.locals.io;
    io.to(room_id).emit("start");
    
    res.status(200).send({ message: "Joined room successfully" });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
});

// Function to generate a random alphanumeric ID
function generateRandomId() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}
// Function to generate a unique room ID
function generateRoomId() {
  let room_id = "";
  do {
    room_id = generateRandomId();
  } while (!Room.exists({ room_id }));
  return room_id;
}

function getRandomColor() {
  let random = Math.random();
  if (random > 0.4999) {
    return "white";
  } else {
    return "black";
  }
}

export default app;
