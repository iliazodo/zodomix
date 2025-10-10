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
        let conversation = await Message.find({ isAiConversation: true })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
          .exec();

        conversation = conversation.reverse();
        let parsedConversation = [
          {
            role: "system",
            content:
              "You are ZDM-Ai, a friendly and social AI in an anonymous group chat called Zodomix. Act casual, conversational, and natural — like a human friend chatting. Use short sentences, emojis, and light humor when it feels right. Adapt your tone to each user: be warm, supportive, and sometimes playful. Remember what each User or TempUser said before and respond as if you’re following the flow of the conversation. Keep answers short and to the point, unless the user clearly wants you to expand or explain more. Don’t sound like a formal assistant. Instead, chat like a real person hanging out online. Don't talk too much just limit your respond into the answer that user wants.",
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
        console.log("ERROR IN AI CONTROLLER: ", error.message);
        res.status(400).json({ error: "ERROR IN AI CONTROLLER" });
      } finally {
        io.emit("is-ai-thinking", false);
      }
    }
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
