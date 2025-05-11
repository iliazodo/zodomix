import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../myCookie/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if(username >= 25){
      return res.status(400).json({error: "USERNAME MUST LESS THAN 25 CHARACTERS"})
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "PASSWORDS DON'T MATCH" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "USER ALREADY EXIST" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPass,
      profilePic: Math.ceil(Math.random() * 12)
    });

    if (newUser) {
      generateToken(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profilePic
      });
    } else {
      res.status(400).json({ error: "INVALID USER DATA" });
    }
  } catch (error) {
    console.log("ERROR IN AUTHCONTROLLER ", error.message);
    res.status(500).json({ error: "INTERVAL SERVER ERROR" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const passwordCheck = await bcrypt.compare(password, user?.password || "");

    if (!user || !passwordCheck) {
      return res.status(400).json({ error: "INVALID USER OR PASSWORD" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic
    });
  } catch (error) {
    console.log("ERROR IN AUTHCONTROLLER" , error.message);
    res.status(500).json({error:"INTERVAL SERVER ERROR"});
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt" , "" , {maxAge:0});
    res.status(200).json({message:"LOGGED OUT SUCCESSFULLY"})
  } catch (error) {
    console.log("ERROR IN AUTHCONTROLLER " , error.message);
    res.status(500).json({error:"INTERVAL SERVER ERROR"});
  }
};
