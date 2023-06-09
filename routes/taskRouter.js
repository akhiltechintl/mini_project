const controller = require("../controller/taskController");
const express = require('express')

const router = express.Router()

router.route("/add-task").post(controller.addTask);
router.route("/update-task").put(controller.updateTask)
router.route("/delete-task").delete(controller.deleteTask)


module.exports = router