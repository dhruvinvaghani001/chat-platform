import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    membes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      type: monogoose.Schema.Types.ObjectId,
      ref: "Chatmessage",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
