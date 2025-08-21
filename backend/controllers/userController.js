import User from "../models/userModel.js";
import Group from "../models/groupModel.js";

export const addUser = async (req , res) => {
    try {
        const {groupId , username} = req.body;
        const userId = req.user._id;

        const addUser = await User.findOne({username});
        const user = await User.findById(userId);

        if(!addUser){
            return res.status(404).json({error:"USER NOT EXIST"});
        }

        if(!user.ownGroups.includes(groupId)){
            return res.status(400).json({error:"ACTION DENIED"});
        }

        const group = await Group.findById(groupId);

        group.members.push(addUser._id);
        await group.save();

        res.status(200).json({message: "USER ADDED SUCCESSFULLY"});
        
    } catch (error) {
        console.log("ERROR IN USERCONTROLLER: " , error.message);
        res.status(500).json({error:"INTERNAL SERVER ERROR"});
    }
}