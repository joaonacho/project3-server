const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  poster: String,
  title: String,
  content: String,
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Post", postSchema);
