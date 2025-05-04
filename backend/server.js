import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/authRouter.js";
import messageRoutes from "./routes/messageRouter.js";
import userRoutes from "./routes/userRouter.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const port = process.env.PORT || 3030;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://zodomix.onrender.com",
    credentials: true,
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);


app.use(express.static(path.join(__dirname, "/frontend/dist")));

// serve SPA for any path not handled above
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});





server.listen(port, () => {
  console.log(`server is running on port: ${port}`);
  connectToMongoDB();
});