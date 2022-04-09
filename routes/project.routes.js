const Project = require("../models/Project.model");
const Task = require("../models/Task.model");
const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUpload = require("../config/cloudinary");

//GET all projects
router.get("/projects", async (req, res) => {
  try {
    const response = await Project.find().populate("tasks");
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
    console.log("error occurred bro", e);
  }
});

//POST create projects
router.post("/projects", async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    if (!title || !description) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    const newProject = await Project.create({
      title,
      description,
      imageUrl,
      tasks: [],
    });

    res.status(200).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});
//DELETE
router.delete("/projects/:projectId", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.projectId);

    res.status(200).json({
      message: `project with ID: ${req.params.projectId} was deleted`,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//GET one project
router.get("/projects/:projectId", async (req, res) => {
  try {
    const response = await Project.findById(req.params.projectId).populate(
      "tasks"
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//UPDATE (PUT or PATCH)
router.put("/projects/:projectId", async (req, res) => {
  try {
    const { title, description } = req.body;

    const response = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        title,
        description,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//POST create tasks
router.post("/tasks", async (req, res) => {
  try {
    const { title, description, projectId } = req.body;
    const response = await Task.create({ title, description });
    const projectResponse = await Project.findByIdAndUpdate(
      projectId,
      {
        $push: { tasks: response._id },
      },
      { new: true }
    );
    res.status(200).json(projectResponse);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/upload", fileUpload.single("file"), (req, res) => {
  try {
    res.status(200).json({ fileUrl: req.file.path });
  } catch (e) {
    res.status(500).json({
      message: `An error occured while uploading the image - ${e.message}`,
    });
  }
});

module.exports = router;
