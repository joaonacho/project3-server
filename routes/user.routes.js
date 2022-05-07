const router = require("express").Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//GET user profile
router.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const foundUser = await User.findOne({ username }).populate("favourites");
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//PUT edit user profile
router.put("/profile/:username/edit", async (req, res) => {
  try {
    const { username } = req.params;
    const { genres, country, about, profileImg } = req.body;

    const foundUser = await User.findOneAndUpdate(
      { username },
      {
        country: country,
        genres: genres,
        about: about,
        profileImg,
      },
      { new: true }
    );
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//GET generic random 6 users to display in homepage
router.get("/random-users", async (req, res) => {
  try {
    const users = await User.find();

    let randomPos;
    let temp;

    for (let i = users.length - 1; i > 0; i--) {
      randomPos = Math.floor(Math.random() * (i + 1));
      temp = users[i];
      users[i] = users[randomPos];
      users[randomPos] = temp;
    }

    let sixUsers = users.slice(0, 6);

    res.status(200).json(sixUsers);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//GET search users
router.get("/search-users/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const usersInDB = await User.find();

    const usersFound = usersInDB.filter((user) => {
      return user.username.toLowerCase().replace(" ", "").includes(query);
    });

    res.status(200).json(usersFound);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//PUT follow users
router.put("/profile/:username/follow", async (req, res) => {
  try {
    const { username } = req.params;

    //user that is being followed
    const userToFollow = await User.findOne({ username: username });

    //user that follows
    const followingUser = await User.findById(req.body.user._id);

    if (!userToFollow.followers.includes(followingUser._id)) {
      await User.findByIdAndUpdate(
        userToFollow._id,
        { $push: { followers: followingUser._id } },
        { new: true }
      );
    }

    if (!followingUser.follows.includes(userToFollow._id)) {
      await User.findByIdAndUpdate(
        followingUser._id,
        {
          $push: { follows: userToFollow._id },
        },
        { new: true }
      );
    }

    res.status(200).json(followingUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//PUT unfollow users
router.put("/profile/:username/unfollow", async (req, res) => {
  try {
    const { username } = req.params;

    //user that is being unfollowed
    const userToUnfollow = await User.findOne({ username: username });

    //user that unfollows
    const unfollowingUser = await User.findById(req.body.user._id);

    if (userToUnfollow.followers.includes(unfollowingUser._id)) {
      await User.findByIdAndUpdate(
        userToUnfollow._id,
        { $pull: { followers: unfollowingUser._id } },
        { new: true }
      );
    }

    if (unfollowingUser.follows.includes(userToUnfollow._id)) {
      await User.findByIdAndUpdate(
        unfollowingUser._id,
        {
          $pull: { follows: userToUnfollow._id },
        },
        { new: true }
      );
    }

    res.status(200).json(unfollowingUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//GET users that match genres
router.get("/similar-genres/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const foundUser = await User.findOne({ username: username });

    const allUsers = await User.find();
    const { genres } = foundUser;

    let matchedUsers = [];
    genres.forEach((genre) => {
      allUsers.filter((user) => {
        if (user.genres.includes(genre)) {
          matchedUsers.push(user);
        }
      });
    });

    let filteredMatchedUsers = [...new Set(matchedUsers)].filter((user) => {
      return user.username !== username;
    });

    res.status(200).json(filteredMatchedUsers);
  } catch (error) {
    res.status(500).json({ error });
  }
});
module.exports = router;
