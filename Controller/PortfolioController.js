const portfolioModel = require("../Models/Portfolio");


exports.addPortfolio = async (req, res) => {
    try {
        const portfolioId = await generateId();
        const portfolio = {
            portfolioDescription,
            status,
            portfolioManager,
            portfolioName,
            projectId
        } = req.body;

        portfolio.portfolioId = portfolioId;

        const save = await portfolioModel.create(portfolio)
        return res.status(200).json({"Message": "Portfolio Saved Successfully", "Data": save})

    } catch (error) {
        return res.status(400).json({"error": error.message})
    }

};


exports.getAll = async (req, res) => {
    try {
        const findAll = await portfolioModel.find();
        console.log(findAll)
        return res.status(200).json({"data": findAll});
    } catch (error) {
        res.send(400).json({"error": error.message})
    }
}


exports.updatePortfolio = async (req, res) => {
    const portfolioId = req.body.portfolioId;
    console.log("portfolioId", portfolioId)
    if (!portfolioId) {
        return res.status(200).json({"message": "Project Id is null"});
    }

    try {
        const update = await portfolioModel.updateOne(
            {portfolioId: portfolioId},
            {$set: req.body},
            {new: false, upsert: false}
        );
        if (update.modifiedCount > 0 && update.matchedCount > 0) {
            return res.status(200).json({"Message": "portfolioId Updated Successfully"});
        } else {
            return res.status(200).json({"message": "No record found"});
        }
    } catch (error) {
        return res.status(400).json({"error": error.message});
    }
};


exports.deletePortfolio = async (req, res) => {
    const portfolioId = req.params.portfolioId;
    console.log("portfolio Id ", portfolioId)
    if (!portfolioId) {
        return res.status(200).json({"message": "Portfolio id is required to perform this action"})
    }
    try {
        const deleted = await portfolioModel.deleteOne({portfolioId: portfolioId})
        if (deleted.deletedCount === 1) {
            return res.status(200).json({"message": "deleted"})
        }
        if (deleted.deletedCount === 0) {
            return res.status(200).json({"message": "Portfolio Id not match"})

        }
    } catch (error) {
        return res.status(400).json({"error": error.message})

    }
}


exports.addProjectToPortfolio = async (req, res) => {
    try {
        const {portfolioId} = req.params;
        const {projectId} = req.body;
        if (!portfolioId || !projectId) {
            return res.status(200).json({"message": "Portfolio ID and Project ID is Required"})
        }
        const updatedPortfolio = await portfolioModel.findOneAndUpdate(
            {portfolioId},
            {$push: {"projectId.ids": {$each: projectId?.ids || []}}},
            {new: true}
        );

        if (!updatedPortfolio) {
            return res.status(200).json({"message": "Portfolio not found"});
        }

        res.json({"message": "Successfully added project IDs to the portfolio", portfolio: updatedPortfolio});
    } catch (error) {
        res.status(400).send({"error": error.message});
    }
};


async function generateId() {
    const lastPortfolioid = await portfolioModel.findOne({}, {}, {sort: {portfolioId: -1}});

    if (lastPortfolioid) {
        const lastId = lastPortfolioid.portfolioId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}