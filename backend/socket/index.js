import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("user joined socket", socket.id);

  socket.on("setup", ({ userId }) => {
    console.log("user joined room :" + userId);
    socket.join(userId.toString());
  });
});

export { app, server, io };
