const ProjectController = require("../controller/ProjectController");
const express = require('express')
const authController = require("../controller/AuthController");
const {authenticateToken, checkRole} = require("../Middleware/JwtAuth");
const router = express.Router()

router.route("/add").post(authenticateToken,checkRole,ProjectController.addProject);
router.route("/get-all").post(ProjectController.getAll);
router.route("/get-by-id").post(ProjectController.getById);
router.route("/non-portfolio").post(authenticateToken,checkRole,ProjectController.notAssignedProjects);
router.route("/tag-portfolio/:projectId").post(authenticateToken,checkRole,ProjectController.tagPortfolio);
router.route("/update").put(authenticateToken,checkRole,ProjectController.update);
router.route("/delete/:projectId").delete(authenticateToken,checkRole,ProjectController.deleteProject);

module.exports = router