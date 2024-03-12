import mongoose from "mongoose";

const messageShcema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    attachmentFiles : [
      {
        url: String, // it stores server path of image
        localPath: String, //it stores local path its not necessary but we streo
      },
    ],
  },
  { timestamps: true }
);

const Chatmessage = mongoose.model("Chatmessage", messageShcema);

export default Chatmessage;
