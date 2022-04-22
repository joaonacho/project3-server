const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    movie: { type: Schema.Types.ObjectId, ref: "Movie" },
    review: String,
    rating: { type: Number, min: 0, max: 10, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Review", reviewSchema);
