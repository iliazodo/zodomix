import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  groupType: {
    type: String,
    enum: ["main", "uCreation"],
    default: "uCreation",
  },
  picture: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  members: {
    type: [String],
  },
  isPublic: {
    type: Boolean,
  },
  isAnonymous: {
    type: Boolean,
  },
  password: {
    type: String,
    default: "",
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  voiceMembers: [
    {
      socketId: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
    },
  ],
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
