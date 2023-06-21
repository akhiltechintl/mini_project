const ProjectController = require("../controller/ProjectController");
const express = require('express')
const authController = require("../controller/AuthController");
const {authenticateToken, checkRole, validateToken} = require("../Middleware/JwtAuth");
const router = express.Router()

router.use(validateToken);
router.route("/get-all").post(ProjectController.getAll);
router.route("/get-by-id").post(ProjectController.getById);

router.use(authenticateToken);

router.route("/add").post(ProjectController.addProject);
router.route("/non-portfolio").post(ProjectController.notAssignedProjects);
router.route("/tag-portfolio/:portfolioId").post(ProjectController.tagPortfolio);
router.route("/update").put(ProjectController.update);
router.route("/delete/:projectId").delete(ProjectController.deleteProject);

module.exports = router