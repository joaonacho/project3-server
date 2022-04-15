const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    content: String,
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
