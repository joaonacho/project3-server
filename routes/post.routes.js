const router = require("express").Router();
const User = require("../models/User.model");
const Post = require("../models/Post.model.js");
const Comment = require("../models/Comment.model");

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

//POST delete a post
router.delete("/delete/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const postToDelete = await Post.findById(postId).populate("author");

    await User.findByIdAndUpdate(
      postToDelete.author._id,
      { $pull: { posts: postToDelete._id } },
      { new: true }
    );

    const deletedPost = await Post.findByIdAndDelete(postId);

    res.status(200).json(deletedPost);
  } catch (error) {
    console.log("error", error.message);
    res.status(500).json({ error });
  }
});

//COMMENTS
//POST create comment
router.post("/comment/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body.comment;
    const { user } = req.body.comment;

    const createdComment = await Comment.create({
      author: user,
      post: postId,
      content: comment,
    });

    const foundPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: createdComment._id },
      },
      { new: true }
    );

    res.status(200).json(foundPost);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//GET display post comments
router.get("/comment/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const commentsInPost = await Post.findById(postId).populate({
      path: "comments",
      populate: { path: "author" },
    });

    res.status(200).json(commentsInPost);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//LIKES
//PUT like a post
router.put("/like/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const postToLike = await Post.findById(postId);

    if (!postToLike.likes.includes(userId)) {
      await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true }
      );
    }

    res.status(200).json(postToLike);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//PUT dislike a post
router.put("/dislike/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const postToDislike = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    res.status(200).json(postToDislike);
  } catch (error) {
    res.status(500).json({ error });
  }
});
module.exports = router;
