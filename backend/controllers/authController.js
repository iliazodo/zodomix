import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../myCookie/generateToken.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import {sendTelegramMessage, sendVerificationEmail, sendPasswordResetEmail} from "../utils/sendEmail.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (username.length >= 25) {
      return res
        .status(400)
        .json({ error: "USERNAME MUST LESS THAN 25 CHARACTERS" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "PASSWORDS DON'T MATCH" });
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (user) {
      if (!user.isVerified) {
        await User.deleteOne({ username: username.toLowerCase() });
      } else {
        return res.status(400).json({ error: "USER ALREADY EXIST" });
      }
    }

    const otherEmail = await User.findOne({ email: email.toLowerCase() });

    if (otherEmail) {
      if (!otherEmail.isVerified) {
        await User.deleteOne({ email: email.toLowerCase() });
      } else {
        return res.status(400).json({ error: "EMAIL ALREADY EXIST" });
      }
    }

    // Create jsonwebtoken for verification
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    let humanNum = Math.floor(Math.random() * 100000000);
    let othersNum = await User.findOne({ humanNum });

    while (othersNum) {
      humanNum = Math.floor(Math.random() * 100000000);
      othersNum = await User.findOne({ humanNum });
    }

    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPass,
      profilePic: Math.ceil(Math.random() * 12),
      humanNum,
    });

    if (newUser) {
      await newUser.save();

      await sendVerificationEmail(email, `https://zodomix.com/verify/${token}`);

      sendTelegramMessage("A NEW USER BORNED");
      res.status(201).json({ message: "Verification email sent" });
    } else {
      res.status(400).json({ error: "INVALID USER DATA" });
    }
  } catch (error) {
    console.log("ERROR IN AUTHCONTROLLER ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username.toLowerCase() });
    const passwordCheck = await bcrypt.compare(password, user?.password || "");

    if (!user || !passwordCheck) {
      return res.status(400).json({ error: "INVALID USER OR PASSWORD" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: "EMAIL NOT VERIFIED" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      humanNum: user.humanNum,
      messagesNum: user.messagesNum,
    });
  } catch (error) {
    console.log("ERROR IN AUTHCONTROLLER", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always respond the same way to prevent email enumeration
    if (!user || !user.isVerified) {
      return res.status(200).json({ message: "IF THAT EMAIL EXISTS, A RESET LINK HAS BEEN SENT" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, `https://zodomix.com/reset-password/${token}`);

    res.status(200).json({ message: "IF THAT EMAIL EXISTS, A RESET LINK HAS BEEN SENT" });
  } catch (error) {
    console.log("ERROR IN AUTHCONTROLLER ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "PASSWORDS DON'T MATCH" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "PASSWORD MUST BE AT LEAST 6 CHARACTERS" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ error: "INVALID OR EXPIRED RESET LINK" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "PASSWORD RESET SUCCESSFULLY" });
  } catch (error) {
    console.log("ERROR IN AUTHCONTROLLER ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "LOGGED OUT SUCCESSFULLY" });
  } catch (error) {
    console.log("ERROR IN AUTHCONTROLLER ", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};
