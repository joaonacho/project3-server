const { Schema, model } = require("mongoose");

const movieSchema = new Schema({
  title: String,
  poster_path: String,
  overview: String,
  tagline: String,
  vote_average: { type: Number, min: 0, max: 10 },
  release_date: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

module.exports = model("Movie", movieSchema);
