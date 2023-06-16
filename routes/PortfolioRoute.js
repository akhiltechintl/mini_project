const PortfolioController = require("../controller/PortfolioController");
const express = require('express')
const authController = require("../controller/AuthController");
const {authenticateToken, checkRole} = require("../Middleware/JwtAuth");
const router = express.Router()

router.route("/add").post(authenticateToken,checkRole,PortfolioController.addPortfolio);
router.route("/get-all").post(PortfolioController.getAll);
router.route("/add-project/:portfolioId").post(authenticateToken,checkRole,PortfolioController.addProjectToPortfolio);
router.route("/update").put(authenticateToken,checkRole,PortfolioController.updatePortfolio);
router.route("/delete/:portfolioId").delete(authenticateToken,checkRole,PortfolioController.deletePortfolio);

module.exports = router