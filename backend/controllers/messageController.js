import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const senderId = req.user._id;
    const groupName = req.params.group;

    if (!message) {
      return res.status(400).json({ error: "MESSAGE REQUIRE" });
    }

    if (!senderId) {
      return res.status(400).json({ error: "INVALID USER" });
    }

    if (!groupName) {
      return res.status(404).json({ error: "NO GROUP FOUNDED" });
    }

    const newMessage = new Message({
      senderId,
      groupName,
      message,
    });

    newMessage.save();

    res.status(201).json({message: "MESSAGE CREATED SUCCESSFULLY"});

  } catch (error) {
    console.log("ERROR IN MESSAGECONTROLLER: " , error.message);
    res.status(500).json({error:"INTERVAL SERVER ERROR"});
  }
};

export const getMessage = async (req ,res) => {
  try {

    const group = req.params.group;

    const messages = await Message.find({groupName: group});

    res.status(200).json(messages);

  } catch (error) {
    console.log("ERROR IN MESSAGECONTROLLER: " , error.message);
    res.status(500).json({error:"INTERVAL SERVER ERROR"});
  }
}