import mongoose from "mongoose";

const unreadMessagesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    unreadMesssage: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chatmessage",
      },
    ],
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

const UnreadMessage = mongoose.model("UnreadMessage", unreadMessagesSchema);
export default UnreadMessage;
