import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import AccountRequests from "./routes/AccountRequests.js";
const app = express();
const PORT = process.env.PORT || 3500;

// Middleware configuration
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("api/accounts", AccountRequests);

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Successfully connected to MongoDB");
  app.listen(PORT, () => {
    console.log("Server is running successfully");
  });
});
