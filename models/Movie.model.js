const { Schema, model } = require("mongoose");

const movieSchema = new Schema({
  title: String,
  posterURL: String,
  director: String,
  review: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = model("Movie", movieSchema);
