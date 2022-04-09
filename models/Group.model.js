const { Schema, model } = require("mongoose");

const groupSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, ref: "User" },
  groupName: {
    type: String,
    required: [true, "Name your group."],
  },
  description: String,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  groupImg: {
    type: String,
    default: "",
  },
});

const Group = model("Group", groupSchema);

module.exports = Group;
