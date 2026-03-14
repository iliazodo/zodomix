import User from "../models/userModel.js";
import Group from "../models/groupModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export const addUser = async (req, res) => {
  try {
    const { groupId, username } = req.body;
    const userId = req.user._id;

    const addUser = await User.findOne({ username });
    const user = await User.findById(userId);

    if (!addUser) {
      return res.status(404).json({ error: "USER NOT EXIST" });
    }

    if (!user.ownGroups.includes(groupId)) {
      return res.status(400).json({ error: "ACTION DENIED" });
    }

    const group = await Group.findById(groupId);

    group.members.push(addUser._id);
    await group.save();

    res.status(200).json({ message: "USER ADDED SUCCESSFULLY" });
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const isUserValid = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "USER NOT FOUND" });
    res.status(200).json(user);
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getProfilePictures = (req, res) => {
  try {
    const __dirname = path.resolve();
    let dir = path.join(__dirname, "frontend/dist/profiles");
    if (!fs.existsSync(dir)) {
      dir = path.join(__dirname, "frontend/public/profiles");
    }
    const files = fs.readdirSync(dir);
    const numbered = files.filter((f) => /^\d+\.png$/i.test(f));
    res.status(200).json(numbered);
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, profilePic } = req.body;
    const userId = req.user._id;

    const update = {};
    if (bio !== undefined) update.bio = bio;
    if (profilePic !== undefined) update.profilePic = profilePic;

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const muteUser = async (req, res) => {
  try {
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: "TARGET ID REQUIRED" });
    if (targetId === req.user._id.toString()) return res.status(400).json({ error: "CANNOT MUTE YOURSELF" });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { muteList: targetId } });
    res.status(200).json({ message: "MUTED" });
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const unmuteUser = async (req, res) => {
  try {
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: "TARGET ID REQUIRED" });
    await User.findByIdAndUpdate(req.user._id, { $pull: { muteList: targetId } });
    res.status(200).json({ message: "UNMUTED" });
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: "TARGET ID REQUIRED" });
    if (targetId === req.user._id.toString()) return res.status(400).json({ error: "CANNOT BLOCK YOURSELF" });
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { blockList: targetId } });
    res.status(200).json({ message: "BLOCKED" });
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: "TARGET ID REQUIRED" });
    await User.findByIdAndUpdate(req.user._id, { $pull: { blockList: targetId } });
    res.status(200).json({ message: "UNBLOCKED" });
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getLists = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("muteList", "_id username profilePic humanNum")
      .populate("blockList", "_id username profilePic humanNum")
      .select("muteList blockList");
    res.status(200).json(user);
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ isVerified: true })
      .sort({ messagesNum: -1 })
      .limit(5)
      .select("username profilePic messagesNum humanNum");

    res.status(200).json(users);
  } catch (error) {
    console.log("ERROR IN USERCONTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};
