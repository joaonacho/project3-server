const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "You need to use a valid email."],
    lowercase: true,
    trim: true,
  },
  profileImg: {
    type: String,
    default:
      "https://res.cloudinary.com/dxxmsbtrt/image/upload/v1645126731/SecretSanta/avatar-profile_ty1qpt.webp",
  },
  genres: String,
  about: String,
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  follows: [{ type: Schema.Types.ObjectId, ref: "User" }],
  favourites: [{ type: Schema.Types.ObjectId, ref: "Movie" }],
  review: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

const User = model("User", userSchema);

module.exports = User;
