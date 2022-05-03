const router = require("express").Router();
const User = require("../models/User.model");
const Post = require("../models/Post.model.js");

//GET user feed and display posts from follows
router.get("/feed/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const loggedUser = await User.findOne({ username: username }).populate(
      "follows"
    );
    const { follows } = loggedUser;

    const allPosts = await Post.find().populate("author");
    const loggedUserPosts = allPosts.filter(
      (post) => post.author.username === loggedUser.username
    );

    let followsPosts = [];
    follows.forEach((follow) => {
      let foundFollowPosts = allPosts.filter(
        (post) => post.author.username === follow.username
      );
      followsPosts.push(...foundFollowPosts);
    });

    res.status(200).json([...loggedUserPosts, ...followsPosts]);
  } catch (error) {
    console.error({ message: error.message });
    res.status(500).json({ error });
  }
});

//POST create a post
router.post("/create-post", async (req, res) => {
  try {
    const { poster, content, likes, comments } = req.body.post;
    const { author } = req.body.post;

    const newPost = await Post.create({
      author,
      poster,
      content,
      likes,
      comments,
    });

    console.log(newPost);
    await User.findByIdAndUpdate(
      author,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
