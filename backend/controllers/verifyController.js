import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const verifyEmail = async (req, res) => {
  try {
    const { email } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "USER NOT FOUND" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "EMAIL ALREADY VERIFIED" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "EMAIL VERIFIED!" });
  } catch (error) {
    console.log("ERROR IN VERIFY CONTROLLER:", error.message);
    res.status(400).json({ error: "INVALID OR EXPIRED TOKEN" });
  }
};
