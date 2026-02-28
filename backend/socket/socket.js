import { Server } from "socket.io";
import http from "http";
import express from "express";
import Group from "../models/groupModel.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? "https://zodomix.com" : "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A USER CONNECTED:", socket.id);

  /* ---------------- USER INFO ---------------- */

  socket.on("requestUserInfo", () => {
    socket.emit("userSocketId", {
      id: socket.id,
      pic: Math.ceil(Math.random() * 12),
    });
  });

  /* ---------------- VOICE CHAT ---------------- */

  socket.on("joinVoiceGroup", async (groupId) => {
    const room = io.sockets.adapter.rooms.get(groupId);
    const size = room ? room.size : 0;

    // Limit voice room to 4 users
    if (size >= 4) {
      socket.emit("voiceRoomFull");
      return;
    }

    socket.join(groupId);
    socket.voiceGroupId = groupId; // Track which group this socket is in

    socket.to(groupId).emit("newUserJoined", socket.id);
  });

  socket.on("offer", ({ to, offer }) => {
    io.to(to).emit("offer", {
      offer,
      from: socket.id,
    });
  });

  socket.on("answer", ({ to, answer }) => {
    io.to(to).emit("answer", {
      answer,
      from: socket.id,
    });
  });

  socket.on("iceCandidate", ({ to, candidate }) => {
    io.to(to).emit("iceCandidate", {
      candidate,
      from: socket.id,
    });
  });

  /* ---------------- LEAVE VOICE ---------------- */

  socket.on("leaveVoiceGroup", async (groupId) => {

    // Remove from DB
    await Group.findByIdAndUpdate(groupId, {
      $pull: { voiceMembers: { socketId: socket.id } },
    });

    socket.to(groupId).emit("userLeft", socket.id);
  });

  /* ---------------- DISCONNECT ---------------- */

  socket.on("disconnect", async () => {
  console.log("USER DISCONNECTED:", socket.id);

  const groupId = socket.voiceGroupId;
  if (!groupId) return;

  // Find the member in group to get userId
  const group = await Group.findById(groupId);
  if (!group) return;

  const member = group.voiceMembers.find(
    (m) => m.socketId === socket.id
  );

  if (!member) return;

  // Remove from DB
  await Group.findByIdAndUpdate(groupId, {
    $pull: { voiceMembers: { socketId: socket.id } },
  });

  // Emit full object to group
  socket.to(groupId).emit(`voiceMemberRemoved-${groupId}`, {
    socketId: socket.id,
    user: member.user,
  });

  socket.leave(groupId);
});
});

export { app, io, server };