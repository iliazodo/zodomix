import bcrypt from "bcryptjs";

import Group from "../models/groupModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, isPublic, isAnonymous, password, categories } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user.messagesNum < 50 && user.ownGroups.length > 0) {
      return res.status(403).json({ error: "RIGHT NOW YOU CAN ONLY HAVE 1 GROUP" });
    } else if (user.messagesNum < 100 && user.ownGroups.length > 1) {
      return res.status(403).json({ error: "RIGHT NOW YOU CAN ONLY HAVE 2 GROUPS" });
    } else if (user.messagesNum < 200 && user.ownGroups.length > 2) {
      return res.status(403).json({ error: "RIGHT NOW YOU CAN ONLY HAVE 3 GROUPS" });
    } else if (user.messagesNum < 400 && user.ownGroups.length > 3) {
      return res.status(403).json({ error: "RIGHT NOW YOU CAN ONLY HAVE 4 GROUPS" });
    } else if (user.messagesNum < 800 && user.ownGroups.length > 4) {
      return res.status(403).json({ error: "RIGHT NOW YOU CAN ONLY HAVE 5 GROUPS" });
    }

    if (name.length > 30) {
      return res.status(400).json({ error: "TOO MUCH CHARACTER FOR NAME" });
    }

    if (!name) {
      return res.status(400).json({ error: "NAME NEEDED" });
    }

    if (await Group.findOne({ name })) {
      return res.status(400).json({ error: "TRY DIFFERENT NAME" });
    }

    if (!isPublic && !password) {
      return res.status(400).json({ error: "CHOOSE A PASSWORD" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const randomPic = Math.ceil(Math.random() * 12);

    const newGroup = new Group({
      name,
      creatorId: userId,
      picture: "group-1",
      description,
      isPublic,
      isAnonymous,
      members: [userId],
      password: hashedPass || "",
      categories: Array.isArray(categories) ? categories.slice(0, 5) : [],
    });

    user.ownGroups.push(newGroup._id);
    await user.save();

    await newGroup.save();

    res.status(201).json({
      id: newGroup._id,
      name: newGroup.name,
      picture: newGroup.picture,
      description: newGroup.description,
      isPublic: newGroup.isPublic,
      members: newGroup.members,
    });
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getGroup = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    const [groups, total] = await Promise.all([
      Group.find().skip(skip).limit(limit),
      Group.countDocuments(),
    ]);

    res.status(200).json({ groups, hasMore: skip + groups.length < total });
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getGroupInfo = async (req, res) => {
  try {
    const { groupName, groupId } = req.body;

    let group;

    if (groupName) {
      group = await Group.findOne({ name: groupName });
    } else if (groupId) {
      group = await Group.findById(groupId);
    } else {
      return res.status(400).json({ error: "NEED GROUP NAME OR GROUP ID" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getMyOwnGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ creatorId: userId }).select("-password");

    if (!groups) {
      return res.status(400).json({ error: "YOU HAVEN'T ANY GROUP" });
    }

    res.status(200).json(groups);
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { groupId, name, description, password, categories } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user.ownGroups.includes(groupId)) {
      return res.status(403).json({ error: "UPDATE DENIED" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);

      await Group.findByIdAndUpdate(
        groupId,
        {
          name,
          description,
          password: hashedPass,
          categories: Array.isArray(categories) ? categories.slice(0, 5) : [],
        },
        { new: true }
      );
    } else {
      await Group.findByIdAndUpdate(
        groupId,
        {
          name,
          description,
          categories: Array.isArray(categories) ? categories.slice(0, 5) : [],
        },
        { new: true }
      );
    }

    res.status(200).json({ message: "GROUP UPDATED SUCCESSFULLY" });
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const group = await Group.findById(groupId);

    if (user.ownGroups.includes(groupId)) {
      await Group.findByIdAndDelete(groupId);

      const index = user.ownGroups.indexOf(groupId);
      user.ownGroups.splice(index, 1);
      await user.save();

      await Message.deleteMany({ groupName: group.name });
    } else {
      return res.status(403).json({ error: "DELETE DENIED" });
    }

    res.status(200).json({ message: "GROUP DELETED SUCCESSFULLY" });
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const addFavGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user._id;

    if (!groupId) {
      return res.status(400).json({ error: "SELECT A GROUP" });
    }

    const group = await Group.findById(groupId);

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ error: "YOU NEED TO LOGIN FOR THIS OPTION" });
    }

    const alreadyExists = user.favGroups.some(
      (fav) => fav.groupName === group.name
    );

    if (!alreadyExists) {
      await User.findByIdAndUpdate(userId, {
        $push: { favGroups: { groupName: group.name, groupPic: group.picture } },
      });
      await Group.findByIdAndUpdate(groupId, { $addToSet: { likes: userId } });
      res.status(200).json({ message: "GROUP ADDED SUCCESSFULLY" });
    } else {
      await User.findByIdAndUpdate(userId, {
        $pull: { favGroups: { groupName: group.name } },
      });
      await Group.findByIdAndUpdate(groupId, { $pull: { likes: userId } });
      res.status(204).json({ error: "GROUP REMOVED SUCCESSFULLY" });
    }
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getFavGroup = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    const validFavGroups = [];

    await Promise.all(
      user.favGroups.map(async (favGroup) => {
        const group = await Group.findOne({ name: favGroup.groupName });
        if (group) validFavGroups.push(favGroup);
      })
    );

    user.favGroups = validFavGroups;
    await user.save();

    if (!user) {
      return res
        .status(401)
        .json({ error: "YOU NEED TO LOGIN FOR THIS OPTION" });
    }

    res.status(200).json(user.favGroups);
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user._id;

    if (!groupId) {
      return res.status(400).json({ error: "GROUP ID REQUIRED" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "GROUP NOT FOUND" });

    const likes = (group.likes || []).map((id) => id.toString());
    const alreadyLiked = likes.includes(userId.toString());

    if (alreadyLiked) {
      await Group.findByIdAndUpdate(groupId, { $pull: { likes: userId } });
      return res.status(200).json({ liked: false, likesCount: likes.length - 1 });
    } else {
      await Group.findByIdAndUpdate(groupId, { $addToSet: { likes: userId } });
      return res.status(200).json({ liked: true, likesCount: likes.length + 1 });
    }
  } catch (error) {
    console.log("ERROR IN GROUPCONTROLLER (toggleLike):", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const sendPass = async (req, res) => {
  try {
    const { password, groupId } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    const isCorrect = await bcrypt.compare(password, group.password);

    if (isCorrect) {
      group.members.push(userId);
      await group.save();
      return res.status(200).json({ message: "PASSWORD IS CORRECT" });
    } else {
      res.status(400).json({ error: "INCORRECT PASSWORD" });
    }
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};
