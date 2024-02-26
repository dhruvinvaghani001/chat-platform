import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);

    console.log("DATABSE CONNECTION DONE : ");
  } catch (error) {
    console.log("ERROR WHIEL CONNECTING DATABASE ,", error);
    process.exit(1);
  }
};

export default connectDB;
