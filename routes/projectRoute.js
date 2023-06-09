const ProjectController = require("../controller/ProjectController");
const express = require('express')

const router = express.Router()

router.route("/add").post(ProjectController.addProject);
router.route("/get-all").post(ProjectController.getAll);
router.route("/get-by-id").post(ProjectController.getById);
router.route("/update").put(ProjectController.update);
router.route("/delete").delete(ProjectController.deleteProject);

module.exports = router