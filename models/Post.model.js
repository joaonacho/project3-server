const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    poster: String,
    content: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);
