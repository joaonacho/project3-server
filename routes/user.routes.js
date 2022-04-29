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

//GET generic random 5 users to display in homepage
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

    let fiveUsers = users.slice(0, 3);

    res.status(200).json(fiveUsers);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//GET search users
router.get("/search-users", async (req, res) => {
  try {
    const usersInDB = await User.find();

    res.status(200).json(usersInDB);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
