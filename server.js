// Backend server for sharito
const express = require("express");
const connectDB = require("./controllers/DBconnect");
const cors = require("cors");
const app = express();
const UserRouter = require("./apis/user/user");
const postRouter = require("./apis/posts/posts");
const messageRouter = require("./apis/messages/message");
const protect = require("./middlewares/authentication");
connectDB();

const port = process.env.PORT || 3002;

const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to the backend of sharito app");
});

app.use("/api/user", UserRouter);
app.use("/api/posts", protect, postRouter);
app.use("/api/messages", messageRouter);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
