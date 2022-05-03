const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    poster: {
      type: String,
      default:
        "https://res.cloudinary.com/dxxmsbtrt/image/upload/v1651586382/MovieScreen/dfcxxx8se4bayk6tqbtq.jpg",
    },
    content: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);
