import Group from "../models/groupModel.js";
import User from "../models/userModel.js";

export const createGroup = async (req, res) => {
  try {
    const { name, picture, description, pass } = req.body;

    if (pass !== "zodomix33all") {
      return res.status(403).json({ error: "YOU HAVE NOT ACCESS" });
    }

    if (!name) {
      return res.status(400).json({ error: "NAME NEEDED" });
    }

    if (await Group.findOne({ name })) {
      return res.status(400).json({ error: "TRY DIFFERENT NAME" });
    }

    const newGroup = new Group({
      name,
      picture,
      description,
    });

    await newGroup.save();

    res.status(201).json({
      name: newGroup.name,
      picture: newGroup.picture,
      description: newGroup.description,
    });
  } catch (error) {
    console.log("ERROR IN GROUPCOTROLLER: ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const getGroup = async (req, res) => {
  try {
    const groups = await Group.find();

    res.status(200).json(groups);
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
      user.favGroups.push({ groupName: group.name, groupPic: group.picture });
      await user.save();
      res.status(200).json({ message: "GROUP ADDED SUCCESSFULLY" });
    } else {
      user.favGroups = user.favGroups.filter(
        (fav) => fav.groupName !== group.name
      );
      await user.save();
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
