const portfolioModel = require("../Models/Portfolio");
const projectModel = require("../Models/Project");

//api to portfolio details
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

//api to get the details of all the portfolios

exports.getAll = async (req, res) => {
    try {
        const findAll = await portfolioModel.find();
        console.log(findAll)
        return res.status(200).json({"data": findAll});
    } catch (error) {
        res.send(400).json({"error": error.message})
    }
}

//api to update portfolio details

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
            return res.status(200).json({"Message": "portfolioId Updated Successfully","data":update});
        } else {
            return res.status(200).json({"message": "No record found"});
        }
    } catch (error) {
        return res.status(400).json({"error": error.message});
    }
};

//api to delete a portfolio by passing portfolio Id

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


// exports.addProjectToPortfolio = async (req, res) => {
//     const { projectId } = req.body;
//     const { portfolioId } = req.params;
//
//     if (!projectId || !portfolioId) {
//         return res.status(200).json({ "Message": "portfolioId Id And Project Id is required" });
//     }
//
//     try {
//         console.log("Entered try:");
//
//         for (let i = 0; i < projectId.ids.length; i++) {
//             console.log("Entered for:");
//
//             const existingProject = await projectModel.findOne({ projectId: projectId.ids[i] });
//             console.log("pro id :", projectId.ids[i]);
//             if (existingProject) {
//                 await projectModel.findOneAndUpdate({ projectId: projectId.ids[i] }, { portfolioId }, { new: true });
//                 console.log("project id :", projectId.ids[i]);
//                 const updatedPortfolio = await portfolioModel.findOneAndUpdate(
//                     { portfolioId },
//                     { $push: { "projectId.ids": projectId.ids[i] } },
//                     { new: true }
//                 );
//
//
//             }else {
//                 return res.status(200).json({ "message": "Project not found" });
//
//             }
//         }
//
//         return res.status(200).json({ "message": "Portfolio Successfully tagged" });
//     } catch (error) {
//         return res.status(400).json({ "error": error.message });
//     }
// };

//Function to generate Id for portfolio
async function generateId() {
    const lastPortfolioid = await portfolioModel.findOne({}, {}, {sort: {portfolioId: -1}});

    if (lastPortfolioid) {
        const lastId = lastPortfolioid.portfolioId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}

//Api to add Projects to a portfolio

exports.addProjectToPortfolio = async (req, res) => {
    const { projectId } = req.body;
    const { portfolioId } = req.params;
const temp=null;
    if (!projectId || !portfolioId) {
        return res.status(200).json({ "Message": "portfolioId Id And Project Id is required" });
    }

    try {
        console.log("Entered try:");

        const updatedProjects = [];
        // const updatedProject = [];
        const notFound = [];

        for (let i = 0; i < projectId.ids.length; i++) {
            console.log("Entered for:");

            const existingProject = await projectModel.findOne({projectId: projectId.ids[i]});


            if (existingProject) {
                await projectModel.findOneAndUpdate({projectId: projectId.ids[i]}, {portfolioId}, {new: true});
                console.log("project id :", projectId.ids[i]);
               const updatedProject = await portfolioModel.findOneAndUpdate(
                    {portfolioId},
                    {$push: {"projectId.ids": projectId.ids[i]}},
                    {new: true}
                );
                console.log("O/P: ", updatedProject[i])

                updatedProjects.push(updatedProject);
            } else {

                notFound[i] = projectId.ids[i];
            }
        }
        if (notFound.length > 0) {
            return res.status(200).json({"message": "some projects not found", "not found": notFound,"updated":updatedProjects});
        } else {
            return res.status(200).json({"message": "success", "data": updatedProjects});
        }


    }  catch (error) {
        return res.status(400).json({ "error": error.message });
    }
};
