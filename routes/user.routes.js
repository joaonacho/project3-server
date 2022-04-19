const router = require("express").Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//GET user profile
router.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const foundUser = await User.findOne({ username });
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//PUT edit user profile -> WIP
router.put("/profile/:username/edit", async (req, res) => {
  try {
    const { username } = req.params;
    const { genres, country, about } = req.body;

    const foundUser = await User.findOneAndUpdate(
      { username },
      {
        country: country,
        genres: genres,
        about: about,
      },
      { new: true }
    );
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
