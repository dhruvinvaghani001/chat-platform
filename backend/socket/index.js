import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  console.log("user joined socket", socket.id);

  socket.on("setup", ({ userId }) => {
    console.log("user joined room :" + userId);
    socket.join(userId.toString());
  });

  // socket.on("new-message", ({ message, chat }) => {
  //   console.log(message);
  //   console.log(chat);
  //   const members = chat.members.filter(
  //     (memebr) => memebr._id != message.sender._id
  //   );
  //   console.log(members)
  //   members.forEach((element) => {
  //     socket.in(element._id.toString()).emit("new message recived", message);
  //   });
  // });
});

export { app, server, io };
