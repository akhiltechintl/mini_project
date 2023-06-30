const controller = require("../controller/PeopleController");
const express = require('express')
const authController = require("../controller/AuthController");
const {authenticateToken, checkRole, validateToken} = require("../Middleware/JwtAuth");
const router = express.Router()
const app = express();
app.set('view engine', 'ejs');


router.route("/get-table").get(controller.getTable);
router.use(validateToken);


router.route("/get-all").post(controller.getPeople);
router.get('/list-all', controller.listPeople);
router.route("/get-assignee").post(controller.getAssignee);

router.use(authenticateToken);

router.route("/add").post(controller.addPeople);
router.route("/update").put( controller.updatePeople);
router.route("/delete/:peopleId").delete( controller.deletePeople);
router.route("/multi-delete").post( controller.multiplePeopleDelete);

module.exports = router