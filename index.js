import express from "express";

const app = express();
const PORT = process.env.PORT || 3500;

app.get("/", (req, res) => {
  res.send("Server is running successfully");
});
app.listen(PORT);
