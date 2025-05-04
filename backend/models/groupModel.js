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
});

const group = mongoose.model("Group", groupSchema);

export default group;
