const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  title: String,
  poster: String,
  description: String,
  projects: { type: Schema.Types.ObjectId, ref: "Project" },
});

module.exports = model("Review", reviewSchema);
