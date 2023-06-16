const controller = require("../controller/taskController");
const express = require('express')
const authController = require("../controller/AuthController");
const {authenticateToken, checkRole} = require("../Middleware/JwtAuth");
const router = express.Router()

router.route("/add-task").post(authenticateToken,checkRole,controller.addTask);
router.route("/get-all").post(controller.getAll);
router.route("/update-task").put(authenticateToken,checkRole,controller.updateTask)
router.route("/add-assignee/:taskId").put(authenticateToken,checkRole,controller.addAssignee)
router.route("/delete-task/:taskId").delete(authenticateToken,checkRole,controller.deleteTask)


module.exports = router