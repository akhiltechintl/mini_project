const controller = require("../controller/taskController");
const express = require('express')
const authController = require("../controller/AuthController");
const {authenticateToken, checkRole, validateToken} = require("../Middleware/JwtAuth");
const router = express.Router()


router.route("/get-table").get(controller.getTable);
router.use(validateToken);
router.route("/get-all").post(controller.getAll);
 router.route("/get-by-id").post(controller.getTaskById);
router.route("/get-task-by-id").post(controller.getById);

router.use(authenticateToken);

router.route("/update-task").put(controller.updateTask)
router.route("/add-assignee/:taskId").put(controller.addAssignee)
router.route("/delete-task/:taskId").delete(controller.deleteTask)
router.route("/multiple-task-delete").post(controller.multipleTaskDelete)
router.route("/add-task").post(controller.addTask);


module.exports = router