import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import connectDB from "./db/index.js";
import VerifyJWT from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/chatMessage.route.js";
import unreadmessageRouter from "./routes/unreadmessages.route.js";

import cors from "cors";
import { app, server } from "./socket/index.js";

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*" // This might give CORS error for some origins due to credentials set to true
        : process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  })
);

app.use("/api/user", userRouter);

app.use("/api/chat", chatRouter);

app.use("/api/message", messageRouter);

app.use("/api/unread-message", unreadmessageRouter);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
});
