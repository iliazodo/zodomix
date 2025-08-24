import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/authRouter.js";
import messageRoutes from "./routes/messageRouter.js";
import userRoutes from "./routes/userRouter.js";
import groupRoutes from "./routes/groupRouter.js";
import verifyRoutes from "./routes/verifyRouter.js";
import aiRoutes from "./routes/aiRouter.js";
import updateRoutes from "./routes/updateRouter.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const port = process.env.PORT || 3030;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://zodomix.com",
    credentials: true,
  })
);

// Rate limit
app.set("trust proxy", 1);
app.get("/ip", (req, res) => {
  res.json({
    ip: req.ip,
    forwarded: req.headers["x-forwarded-for"],
  });
});

// Redirecting users to zodomix.com
app.use((req, res, next) => {
  if (req.hostname === "zodomix.onrender.com") {
    return res.redirect(301, `https://zodomix.com${req.originalUrl}`);
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/update" , updateRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

// serve SPA for any path not handled above
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(port, () => {
  console.log(`server is running on port: ${port}`);
  connectToMongoDB();
});
