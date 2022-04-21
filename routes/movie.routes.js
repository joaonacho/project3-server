const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUpload = require("../config/cloudinary");
const User = require("../models/User.model");
const Movie = require("../models/Movie.model");

//GET all movies
router.get("/movies", async (req, res) => {
  try {
    const allMoviesFromDB = await Movie.find();
    res.status(200).json(allMoviesFromDB);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//POST add movie to favourites
router.post("/movies", async (req, res) => {
  try {
    const { title, posterURL, overview } = req.body;
    const newMovie = await Movie.create({
      title,
      posterURL,
      overview,
      reviews: [],
    });

    // newMovie._id needs to be put in User Favourites Array
    res.status(200).json(newMovie);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//DELETE movie
router.delete("/movies/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    const movieDeleted = await Movie.findByIdAndDelete(movieId);
    res.status(200).json(movieDeleted);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//GET one movie
router.get("/movies/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;

    const foundMovie = await Movie.findById(movieId).populate("reviews");
    res.status(200).json(foundMovie);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//UPDATE (PUT or PATCH)
router.put("/projects/:projectId", async (req, res) => {});

//POST create tasks
router.post("/tasks", async (req, res) => {});

router.post("/upload", fileUpload.single("file"), (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path });
  } catch (e) {
    res.status(500).json({
      message: `An error occured while uploading the image - ${e.message}`,
    });
  }
});

//PUT movie to favourite list
router.put("/movies/add", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      poster_path,
      tagline,
      overview,
      vote_average,
      release_date,
    } = req.body;

    const checkForMovieDB = await Movie.findOne({ title });

    console.log("payload ", req.payload);
    const userFavList = await User.findOne({ username: req.payload.username });

    console.log(userFavList.favourites, "favourite list");
    console.log(checkForMovieDB, "movie in DB??");

    if (
      checkForMovieDB &&
      userFavList.favourites.includes(checkForMovieDB._id)
    ) {
      return;
    }

    if (
      checkForMovieDB &&
      !userFavList.favourites.includes(checkForMovieDB._id)
    ) {
      const response = await User.findOneAndUpdate(
        req.payload.username,
        {
          $push: { favourites: checkForMovieDB._id },
        },
        { new: true }
      );
      res.status(200).json(response);
    }

    if (!checkForMovieDB) {
      console.log("here");
      const movieCreated = await Movie.create({
        title,
        poster_path,
        tagline,
        overview,
        vote_average,
        release_date,
        reviews: [],
      });

      const response = await User.findOneAndUpdate(
        req.payload.username,
        {
          $push: { favourites: movieCreated._id },
        },
        { new: true }
      );
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
