import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import connectDB from "./db/index.js";
import VerifyJWT from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/chatMessage.route.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/api/user", userRouter);

app.use("/api/chat", chatRouter);

app.use("/api/message", messageRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
});
