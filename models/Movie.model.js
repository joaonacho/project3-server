const { Schema, model } = require("mongoose");

const movieSchema = new Schema(
  {
    title: String,
    genres: [{ id: Number, name: String }],
    poster_path: String,
    overview: String,
    tagline: String,
    vote_average: { type: Number, min: 0, max: 10 },
    release_date: String,
    runtime: Number,
    id: Number,
    imdb_id: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Movie", movieSchema);
