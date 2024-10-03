import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/chatMessage.route.js";
import unreadmessageRouter from "./routes/unreadmessages.route.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import cors from "cors";
import { app, server } from "./socket/index.js";
import {
  upload,
  uploadForMessageFile,
} from "./middlewares/multer.middleware.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));


const whitelist = process.env.ALLOW_ORIGINS.split(',');

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}

app.use(cors(corsOptions));

app.use("/api/user", userRouter);

app.use("/api/chat", chatRouter);

app.use("/api/message", messageRouter);

app.use("/api/unread-message", unreadmessageRouter);

app.use("/", (req, res) => {
  res.send("hello");
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
});
