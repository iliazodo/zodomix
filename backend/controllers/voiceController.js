import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import { io } from "../socket/socket.js";
import { sendTelegramMessage } from "../utils/sendEmail.js";

export const addVoiceMember = async (req, res) => {
  try {
    const { socketId, groupId } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "GROUP NOT FOUND" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }

    if (group.voiceMembers.some((member) => member.socketId === socketId)) {
      return res.status(400).json({ error: "USER ALREADY IN VOICE" });
    }

    await Group.findByIdAndUpdate(groupId, {
      $push: {
        voiceMembers: {
          socketId,
          user: user.toObject(),
        },
      },
    });

    // emit only to group
    io.to(groupId).emit(`newVoiceMember-${groupId}`, {
      socketId,
      user: user.toObject(),
    });

    res.status(200).json({ message: "VOICE MEMBER ADDED SUCCESSFULLY" });
  } catch (error) {
    console.log("ERROR IN VOICE CONTROLLER: ", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const removeVoiceMember = async (req, res) => {
  try {
    const { socketId, groupId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "USER NOT FOUND" });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "GROUP NOT FOUND" });
    }

    await Group.findByIdAndUpdate(groupId, {
      $pull: { voiceMembers: { socketId } },
    });

    // emit only to group
    io.to(groupId).emit(`voiceMemberRemoved-${groupId}`, {
      socketId,
      user: user.toObject(),
    });

    res.status(200).json({ message: "VOICE MEMBER REMOVED SUCCESSFULLY" });
  } catch (error) {
    console.log("ERROR IN VOICE CONTROLLER: ", error);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};
