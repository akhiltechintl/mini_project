const PortfolioController = require("../controller/PortfolioController");
const express = require('express')

const router = express.Router()

router.route("/add").post(PortfolioController.addPortfolio);
router.route("/get-all").post(PortfolioController.getAll);
router.route("/add-project").post(PortfolioController.updateProject);
router.route("/update").put(PortfolioController.updatePortfolio);
router.route("/delete/:portfolioId").delete(PortfolioController.deletePortfolio);

module.exports = router