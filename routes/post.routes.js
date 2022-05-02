const router = require("express").Router();
const User = require("../models/User.model");
const Post = require("../models/Post.model.js");

//GET user feed and display posts from follows
router.get("/feed/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const foundUser = await User.findOne({ username: username }).populate({
      path: "follows",
      populate: { path: "followers" },
    });

    res.status(200).json(foundUser);
  } catch (error) {
    console.error({ message: error.message });
    res.status(500).json({ error });
  }
});

//POST create a post
router.post("/create-post", async (req, res) => {
  try {
    console.log(req.body);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
