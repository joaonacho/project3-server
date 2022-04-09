const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const fileUpload = require("../config/cloudinary");

//GET all projects
router.get("/projects", async (req, res) => {});

//POST create projects
router.post("/projects", async (req, res) => {});
//DELETE
router.delete("/projects/:projectId", async (req, res) => {});

//GET one project
router.get("/projects/:projectId", async (req, res) => {});

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

module.exports = router;
