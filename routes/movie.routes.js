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
    console.log(foundMovie);
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
    //grab the info from the moviedetails page
    const {
      title,
      genres,
      poster_path,
      tagline,
      overview,
      vote_average,
      release_date,
      runtime,
      id,
      imdb_id,
    } = req.body;

    //check if movie exists in my DB
    const checkForMovieDB = await Movie.findOne({ id });

    //find user in my DB
    const userFavList = await User.findOne({
      username: req.payload.username,
    });

    //if the movie is in my DB and if the movieID is in the user favourite's array, do nothing - avoid repetitions
    if (
      checkForMovieDB &&
      userFavList.favourites.includes(checkForMovieDB._id)
    ) {
      return res.status(200).json(checkForMovieDB);
    }

    //if the movie is found in my DB and the movieID is NOT in the user favourite's array, put the ID inside
    if (
      checkForMovieDB &&
      !userFavList.favourites.includes(checkForMovieDB._id)
    ) {
      const response = await User.findOneAndUpdate(
        { username: req.payload.username },
        {
          $push: { favourites: checkForMovieDB._id },
        },
        { new: true }
      );

      res.status(200).json(response);
    }

    //If the movie is not found in my DB, it means that the movie was not added to favourite's by any other user, so create a movie in my DB and pass it to the user favourite's array
    if (!checkForMovieDB) {
      const movieCreated = await Movie.create({
        title,
        genres,
        poster_path,
        tagline,
        overview,
        vote_average,
        release_date,
        runtime,
        id,
        imdb_id,
        reviews: [],
      });

      const response = await User.findOneAndUpdate(
        { username: req.payload.username },
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

//PUT remove movie from favourites
router.put("/movies/:movieId/remove", async (req, res) => {
  try {
    const { movieId } = req.params;
    const { username } = req.body;

    //find movie from my DB
    const movieFromDB = await Movie.findOne({ id: movieId });

    //find user in my DB & update favourite list
    const userToUpdate = await User.findOneAndUpdate(
      { username: username },
      {
        $pull: { favourites: movieFromDB._id },
      },
      { new: true }
    );

    res.status(200).json(userToUpdate);
  } catch (error) {
    res.status(500).json({ error });
  }
});
module.exports = router;
