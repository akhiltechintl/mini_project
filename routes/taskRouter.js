const controller = require("../controller/taskController");
const express = require('express')

const router = express.Router()

router.route("/add-task").post(controller.addTask);
router.route("/get-all").post(controller.getAll);
router.route("/update-task").put(controller.updateTask)
router.route("/delete-task/:taskId").delete(controller.deleteTask)


module.exports = router