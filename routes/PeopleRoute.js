const controller = require("../controller/PeopleController");
const express = require('express')

const router = express.Router()

router.route("/add").post(controller.addPeople);
router.route("/get-all").post(controller.getPeople)
router.route("/update").post(controller.updatePeople)
router.route("/delete").delete(controller.deletePeople)

module.exports = router