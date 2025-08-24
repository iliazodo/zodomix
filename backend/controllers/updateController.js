import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import Group from "../models/groupModel.js";

export const updateUserMsg = async (req, res) => {
   try {
//     const users = await User.find();

//     for (const user of users) {
//       let userMessages = 0;

//       const messages = await Message.find({ senderId: user._id });

//       console.log(`\n🧑 User: ${user._id} | Messages found: ${messages.length}`);

//       for (const message of messages) {
//         console.log("➡️ Checking message groupName:", message.groupName);

//         const group = await Group.findOne({
//           name: new RegExp(`^${message.groupName}$`, "i"), // case-insensitive
//         });

//         if (!group) {
//           console.log("   ❌ Group not found for:", message.groupName);
//           continue;
//         }

//         console.log(`   ✅ Found group: ${group.name}, type: ${group.groupType}`);

//         if (group.groupType === "main") {
//           userMessages++;
//         }
//       }

//       user.messagesNum = userMessages;
//       await user.save();

//       console.log(`📝 Updated user ${user._id} with messagesNum = ${user.messagesNum}`);
//     }

//     res.status(200).json({ message: "done" });
  } catch (error) {
    console.log("ERROR IN UPDATE-USER-CONTROLLER:", error.message);
    res.status(500).json({ error: "INTERNAL SERVER ERROR" });
  }
};
