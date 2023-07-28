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
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const Conversation = require("./models/conversations");

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    console.log("USER CONNECTED");
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", async (newMessageRecieved) => {
    console.log("new message");
    console.log(socket.userData);
    var conversationId = newMessageRecieved.conversation;
    var conversation = await Conversation.findById(conversationId);
    // console.log("conversation", conversation);
    if (!conversation.participants)
      return console.log("chat.users not defined");

    conversation.participants.forEach((user) => {
      if (user == newMessageRecieved.sender) return;
      const st = socket
        .in(user.toString())
        .emit("messageRecieved", newMessageRecieved);
      console.log("status:", st);
      console.log(
        "message sent to",
        user.toString(),
        "from",
        newMessageRecieved.sender
      );
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
