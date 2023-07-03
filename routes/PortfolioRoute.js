const PortfolioController = require("../controller/PortfolioController");
const express = require('express')
const authController = require("../controller/AuthController");
const {authenticateToken, checkRole, validateToken} = require("../Middleware/JwtAuth");
const router = express.Router()

router.route("/get-portfolio-list").get(PortfolioController.getPortfolioList);

router.use(validateToken);
router.route("/get-all").post(PortfolioController.getAll);

router.use(authenticateToken);

router.route("/add").post(PortfolioController.addPortfolio);
router.route("/add-project/:portfolioId").post(PortfolioController.addProjectToPortfolio);
router.route("/update").put(PortfolioController.updatePortfolio);
router.route("/delete/:portfolioId").delete(PortfolioController.deletePortfolio);
router.route("/multi-delete").post(PortfolioController.multiplePortfolioDelete);
router.route("/aggregate").post(PortfolioController.aggregate);

module.exports = router