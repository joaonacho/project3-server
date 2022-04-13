const { Schema, model } = require("mongoose");

const movieSchema = new Schema({
  title: String,
  posterURL: String,
  overview: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = model("Movie", movieSchema);
