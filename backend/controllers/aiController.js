import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { io } from "../socket/socket.js";
import { sendTelegramMessage } from "../utils/sendEmail.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

import sendToAi from "../utils/useAi.js";

export const messageToAi = async (req, res) => {
  try {
    const { message, tempUser } = req.body;

    if (!message) {
      return res.status(400).json({ error: "MESSAGE CAN'T BE EMPTY" });
    }

    let senderId = null;

    const token = req.cookies.jwt;
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId).select("-password");
      senderId = user._id;
    }

    const newMessage = new Message({
      senderId: senderId || undefined,
      tempUser,
      message,
      isAiConversation: true,
    });

    const savedMessage = await newMessage.save();

    // Emit new message to all users
    const populatedMessage = await savedMessage.populate(
      "senderId",
      "-password"
    );

    io.emit("newMessage-ai", populatedMessage);
    sendTelegramMessage(newMessage.message);

    // Checking if the the message is calling ai

    const keywords = ["zdm", "ai", "bot", "zdm-bot"];

    if (
      keywords.some((word) => newMessage.message.toLowerCase().includes(word))
    ) {
      io.emit("is-ai-thinking", true);
      try {
        let conversation = await Message.find({ isAiConversation: true });
        let parsedConversation = [
          {
            role: "system",
            content:
              "You are a helpful and friendly Ai in an Anonymous group chat website that named Zodomix. Your name is ZDM-Ai. You will get User id and Temp User id. Answer to each User differently, read their previous messages and then talk with them. Don't talk too much if it's not necessary or do it if user ask for it.",
          },
        ];

        conversation.forEach((msg) => {
          parsedConversation.push({
            role: msg.isAi ? "assistant" : "user",
            content: msg.isAi
              ? msg.message
              : `${
                  msg.senderId
                    ? `User-${msg.senderId}`
                    : `TempUser-${msg.tempUser}`
                } said: ${msg.message}`,
          });
        });

        // Call OpenRouter API with full messages
        const aiReply = await sendToAi(parsedConversation);

        // Add AI reply to conversation and save
        const newAiMessage = new Message({
          message: aiReply,
          isAiConversation: true,
          isAi: true,
        });

        await newAiMessage.save();

        io.emit("newMessage-ai", newAiMessage);

        res.status(201).json(aiReply);

      } catch (error) {
      } finally {
        io.emit("is-ai-thinking", false);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("ERROR IN AICONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};



export const getAiMessages = async (req, res) => {
  try {
    const messages = await Message.find({ isAiConversation: true }).populate(
      "senderId",
      "-password"
    );

    if (!messages) {
      return res.status(404).json({ error: "THERE IS NO MESSAGE YET" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.log("ERROR IN AICONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};
