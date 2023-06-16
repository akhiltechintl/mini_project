const controller = require("../controller/PeopleController");
const express = require('express')
const authController = require("../controller/AuthController");
const {authenticateToken, checkRole} = require("../Middleware/JwtAuth");
const router = express.Router()

router.route("/add").post(authenticateToken,checkRole,controller.addPeople);
router.route("/get-all").post(controller.getPeople)
router.route("/get-assignee").post(controller.getAssignee)
router.route("/update").put(authenticateToken,checkRole,controller.updatePeople)
router.route("/delete/:peopleId").delete(authenticateToken,checkRole,controller.deletePeople)

module.exports = router