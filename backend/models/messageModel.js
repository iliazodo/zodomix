import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
    },
    tempUser: {
      type: String,
      default: "",
    },
    groupName: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    isAi: {
      type: Boolean,
      default: false,
    },
    isAiConversation: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
