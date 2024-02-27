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
      required: true,
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat"
    }
    
  },
  { timestamps: true }
);

const Chatmessage = mongoose.model("Chatmessage", messageShcema);

export default Chatmessage;
