const router = require("express").Router();
const User = require("../models/User.model");

router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params.userId;

    const foundUser = await User.findById(userId);
    console.log(req.params.userId);
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json({ error });
  }
});
module.exports = router;
