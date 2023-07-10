// Backend server for sharito
const express = require("express");
const connectDB = require("./controllers/DBconnect");
const app = express();

const UserRouter = require("./apis/user/user");

connectDB();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the backend of sharito app");
});

app.use("/api/user", UserRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
