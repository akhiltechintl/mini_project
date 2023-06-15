const ProjectController = require("../controller/ProjectController");
const express = require('express')

const router = express.Router()

router.route("/add").post(ProjectController.addProject);
router.route("/get-all").post(ProjectController.getAll);
router.route("/get-by-id").post(ProjectController.getById);
router.route("/non-portfolio").post(ProjectController.notAssignedProjects);
router.route("/tag-portfolio/:projectId").post(ProjectController.tagPortfolio);
router.route("/update").put(ProjectController.update);
router.route("/delete/:projectId").delete(ProjectController.deleteProject);

module.exports = router