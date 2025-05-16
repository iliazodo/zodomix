import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://zodomix.com"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A USER CONNECTED", socket.id);

 socket.on("requestUserInfo", () => {
    socket.emit("userSocketId", {
      id: socket.id,
      pic: Math.ceil(Math.random() * 12),
    });
  });

  socket.on("disconnect", () => {
    console.log("A USER DISCONNECTED");
  });
});

export { app, io, server };
