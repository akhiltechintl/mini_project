const portfolioModel = require("../Models/Portfolio");
const projectModel = require("../Models/Project");
const taskModel = require("../Models/Task");

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

exports.multiplePortfolioDelete = async (req, res) => {
    try {
        const deleted=[];
        const notDeleted=[];
        const {portfolioIds}  = req.body;
        // const length  = req.body.portfolioIds.length;
        console.log("length : ",portfolioIds)
        console.log("port : ",portfolioIds)
        // Delete tasks matching the given task IDs
        for(let i=0; i<portfolioIds.length; i++) {
            const result = await portfolioModel.deleteOne({portfolioId: portfolioIds[i]});

            if(result.deletedCount===1){
                console.log(i ,"th position, deleted :", portfolioIds[i]);
                deleted.push(portfolioIds[i]);
            }
            else if(result.deletedCount===0){
                console.log(i ,"th position ,not deleted :", portfolioIds[i]);
                notDeleted.push( portfolioIds[i]);
                console.log("not deleted :", notDeleted[i]);
            }
        }
        if (notDeleted.length===0) {
            res.status(200).json({
                message: 'portfolio deleted successfully.'
            });
        } else {
            console.log("nottt ",notDeleted)
            res.status(400).json({
                message: 'Some portfolio IDs not found in the database.',
                missingTaskIds: notDeleted,
                deleted:deleted
            });

        } }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting portfolio.' });
    }
};


// exports.aggregateExample = async (req, res) => {
//     const { projectId } = req.body;
//
//     try {
//         const projectDetails = await projectModel.aggregate([
//
//             {
//                 $lookup: {
//                     from: 'projects',
//                     localField: 'portfolioId',
//                     foreignField: 'portfolioId',
//                     as: 'portfolioId',
//                 },
//             },
//             {
//                 $project: {
//                     portfolioId: 1,
//                     portfolioDescription: 1,
//                     status: 1,
//                     'portfolioManager._id': 1,
//                     'portfolioManager.name': 1,
//                     portfolioName: 1,
//                     'tasks.taskName': 1,
//                     'tasks.assignee': 1,
//                     'tasks.taskId': 1,
//                 },
//             },
//         ]);
//
//         if (projectDetails.length === 0) {
//             return res.status(200).json({ "message": 'Project not found' });
//         }
//
//         return res.json(projectDetails[0]);
//     } catch (error) {
//         console.error(error);
//         return res.status(200).json({ "message": error.message });
//     }
// };

// exports.aggregate=async (req,res)=>{
//     try {
//         const {portfolioId} = req.body;
//         const existing = await portfolioModel.find({ portfolioId: portfolioId });
//         return res.status(200).json({body:existing})
// }catch (err){
//         return res.status(200).json({error:err.message})
//
//     }
// }
exports.aggregate = async (req, res) => {
    try {
        const { portfolioId } = req.body;

        const result = await portfolioModel.aggregate([
            {
                $match: { portfolioId: portfolioId }
            },
            {
                $lookup: {
                    from: "projects",
                    let: { portfolioId: "$portfolioId" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$portfolioId", "$$portfolioId"]
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                projectName: 1,
                                projectId: 1,
                                projectOwner: 1,
                                projectDescription: 1
                            }
                        }
                    ],
                    as: "projects"
                }
            }
        ]);

        return res.status(200).json({ body: result });
    } catch (err) {
        return res.status(200).json({ error: err.message });
    }
};

exports.getTable= async (req, res) => {
    try {
        // Fetch projects from the database (assuming you're using Mongoose)
        const portfolios = await portfolioModel.find();
        console.log("portfolio:",portfolios)

        // Render the project.ejs file with the projects data
        res.render('portfolio', { portfolios });
    } catch (error) {
        // Handle error appropriately
        res.status(400).send(error.message);
    }
};