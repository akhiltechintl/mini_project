const authController = require("../controller/AuthController");
const express = require('express')
const {authenticateToken, checkRole} = require("../Middleware/JwtAuth");

const router = express.Router()

router.route("/signin").post(authController.signin)
router.route("/signup").post(authController.signup)
router.route("/test").post(authenticateToken,checkRole,authController.test)
module.exports = router
