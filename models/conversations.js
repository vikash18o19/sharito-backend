const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  participantNames: [{ type: String, required: true }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Conversation", conversationSchema);
