import express from "express";
import Account from "../schemas/Account.js";
import { sha256 } from "js-sha256";

const app = express.Router();

app.post("/create", async (req, res) => {
  let { username, password, date_registered } = req.body;

  // Check if username is provided
  if (!username) {
    return res.status(400).send({ error: "Username is required" });
  }

  // Check if password is provided
  if (!password) {
    return res.status(400).send({ error: "Password is required" });
  }

  // Check if date_registered is provided
  if (!date_registered) {
    return res.status(400).send({ error: "Date registered is required" });
  }

  // Check if account already exists
  if (await Account.exists({ username })) {
    return res.status(409).send({ error: "Account already exists" });
  }

  // Validate username
  if (username.length < 2) {
    return res
      .status(422)
      .send({ error: "Username should be at least 2 characters long" });
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return res
      .status(422)
      .send({ error: "Username should contain only letters and numbers" });
  }

  // Validate password
  if (password.length < 5) {
    return res
      .status(422)
      .send({ error: "Password should be at least 5 characters long" });
  }

  // Validate and process date
  const parsedDate = new Date(date_registered);
  if (isNaN(parsedDate.getTime())) {
    return res.status(422).send({
      error:
        "Invalid date format. Please provide a valid JavaScript Date object",
    });
  }

  // Formatting date, example: "May 15, 2015"
  const formattedDate = parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Register account
  password = sha256(password);
  let newAccount = new Account({
    username,
    password,
    date_registered: formattedDate,
  });

  newAccount.save().then(() => {
    res.status(200).send({ message: "Account created successfully" });
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // Check if username is provided
  if (!username) {
    return res.status(400).send({ error: "Username is required" });
  }

  // Check if password is provided
  if (!password) {
    return res.status(400).send({ error: "Password is required" });
  }
  

  try {
    
    // Check if the account exists
    const account = await Account.findOne({ username });

    if (!account) {
      return res.status(404).send({ error: "Account not found" });
    }

    // Validate the password
    if (account.password !== sha256(password)) {
      return res.status(401).send({ error: "Invalid password" });
    }

    // Successful login
    return res.status(200).send({ message: "Login successful" });
  } catch (error) {
    // Handle any other errors
    return res.status(500).send({ error: "Internal server error" });
  }
});

export default app;
