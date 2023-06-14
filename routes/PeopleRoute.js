const controller = require("../controller/PeopleController");
const express = require('express')

const router = express.Router()

router.route("/add").post(controller.addPeople);
router.route("/get-all").post(controller.getPeople)
router.route("/get-assignee").post(controller.getAssignee)
router.route("/update").put(controller.updatePeople)
router.route("/delete/:peopleId").delete(controller.deletePeople)

module.exports = router