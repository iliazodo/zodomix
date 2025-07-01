import jwt from "jsonwebtoken";

import Message from "../models/messageModel.js";
import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import { io } from "../socket/socket.js";
import { sendTelegramMessage } from "../utils/sendEmail.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, tempUser } = req.body;
    const groupName = req.params.group;

    if (!message) {
      return res.status(400).json({ error: "MESSAGE REQUIRE" });
    }

    let senderId = null;

    const token = req.cookies.jwt;
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId).select("-password");
      senderId = user._id;
    }

    const newMessage = new Message({
      senderId,
      tempUser,
      groupName,
      message,
    });

    const savedMessage = await newMessage.save();

    // Emit new message to all users
    const populatedMessage = await savedMessage.populate(
      "senderId",
      "-password"
    );

    io.emit(`newMessage-${groupName}`, populatedMessage);
    sendTelegramMessage(newMessage.message);

    // Icreasing messageCount
    await Group.findOneAndUpdate(
      { name: groupName },
      { $inc: { messageCount: 1 } }
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log("ERROR IN MESSAGECONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERVAL SERVER ERROR" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const group = req.params.group;

    const messages = await Message.find({ groupName: group }).populate(
      "senderId",
      "-password"
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log("ERROR IN MESSAGECONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERVAL SERVER ERROR" });
  }
};
