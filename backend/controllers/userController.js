import User from "../models/userModel.js";

export const getUser = async (req , res) => {
    try {
        const {userId} = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({error: "INVALID ID"});
        }

        res.status(200).json({
            userId: user._id,
            username: user.username,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("ERROR IN USERCONTROLLER: " , error.message);
        res.status(500).json({error:"INTERVAL SERVER ERROR"});
    }
}