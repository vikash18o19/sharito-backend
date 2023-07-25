const Conversation = require("../models/conversations");

exports.createConversation = async (req, res, next) => {
  const { participants } = req.body;

  try {
    // Check if a conversation with the same participants already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants },
    });

    if (existingConversation) {
      return res.status(400).json({ error: "Conversation already exists." });
    }

    // Create a new conversation
    const conversation = await Conversation.create({ participants });

    return res.status(201).json({ conversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res.status(500).json({ error: "Failed to create conversation." });
  }
};

exports.getUserConversations = async (req, res, next) => {
  const userId = req.user._id.toString();

  try {
    const conversations = await Conversation.find({ participants: userId });

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch user conversations." });
  }
};

const Message = require("../models/messages");

exports.getMessages = async (req, res, next) => {
  const { conversationId } = req.params;
  const userId = req.user._id.toString();
  console.log({ conversationId, userId });
  try {
    // Check if the conversation exists and the user is a participant
    const existingConversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });
    if (!existingConversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }
    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages of a conversation:", error);
    return res.status(500).json({ error: "Failed to fetch messages." });
  }
};

exports.sendMessage = async (req, res, next) => {
  const { conversationId } = req.params;
  const { content } = req.body;
  const sender = req.user._id.toString();
  console.log({
    user: req.user,
    conversationID: conversationId,
    content: content,
    sender: sender,
  });
  try {
    // Check if the conversation exists and the user is a participant
    const existingConversation = await Conversation.findOne({
      _id: conversationId,
      participants: sender,
    });

    if (!existingConversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    // Create and save the message
    const message = await Message.create({
      conversation: conversationId,
      sender,
      content,
    });

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Failed to send message." });
  }
};
