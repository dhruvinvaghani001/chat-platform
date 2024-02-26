import mongoose from "mongoose";

const messageShcema = new mongoose.Schema({}, { timestamps: true });

const Chatmessage = mongoose.model("Chatmessage", messageShcema);

export default Chatmessage;
 