import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: ""
  }
});

const Group = mongoose.model("Group", groupSchema);

export default Group;
