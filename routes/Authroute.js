const authController = require("../controller/AuthController");
const express = require('express')

const router = express.Router()

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors());

// app.use('/auth', require('../controller/AuthController.js'));
router.route("/signin").post(authController.signin)
router.route("/signup").post(authController.signup)
module.exports = router
