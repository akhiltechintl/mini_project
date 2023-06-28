const projectModel = require("../Models/Project");
const jwtAuth = require('../Middleware/jwtAuth');
const portfolioModel = require("../Models/Portfolio");
const taskModel = require("../Models/Task");

//api to save the project details
exports.addProject = async (req, res) => {
            try {
                // const latestProject = await projectModel.findOne({}, {}, { sort: { projectId: -1 } });

                // Increment the ID by 1
                const projectId = await generateId();

                const save = {

                    status,
                    projectName,
                    projectDescription,
                    projectDuration,
                    portfolioId,
                    projectOwner,
                    projectedStartDate,
                    projectedCompletionDate,
                    createdAt,
                    updatedAt
                } = req.body;
                save.projectId = projectId;


                const saved = await projectModel.create(save);

                return res.status(200).json({"Message": "Project Saved Successfully", "Data": saved});
            } catch (error) {
                return res.status(400).json({'error': error.message});

        }
    };

//api to get all the projects
exports.getAll = async (req, res) => {

    try {
        const getAll = await projectModel.find()
        return res.status(200).json({"data": getAll})
    } catch (error) {
        return res.status(400).json({"error": error});
    }
};

//api to update projects
exports.update = async (req, res) => {
    const projectId = req.body.projectId;
    console.log("projectID", projectId)
    if (!projectId) {
        return res.status(200).json({"message": "Project Id is null"});
    }

    try {
        const update = await projectModel.updateOne(
            {projectId: projectId},
            {$set: req.body},
            {new: false, upsert: false}
        );
        if (update.modifiedCount > 0 && update.matchedCount > 0) {
            return res.status(200).json({"Message": "Project Updated Successfully","data":update});
        } else {
            return res.status(200).json({"message": "No record found"});
        }
    } catch (error) {
        return res.status(400).json({"error": error.message});
    }
};

//api tp fetch particular projects by passing the project id
// exports.getById = async (req, res) => {
//     try {
//         const { projectId } = req.body;
//         console.log("projectId", projectId);
//
//         if (!projectId) {
//             return res.status(200).json({ "message": "Project Id is Required" });
//         }
//
//         const existingProject = await projectModel.find({ projectId: projectId });
//         console.log("body", existingProject);
//
//         if (existingProject.length > 0) {
//             console.log("exists");
//             return res.status(200).json({ "data": existingProject });
//         } else {
//             return res.status(200).json({ "message": "project not found" });
//         }
//     } catch (error) {
//         return res.status(400).json({ "error": error.message });
//     }
// };

//api to delete projects by passing project id as parameter
exports.deleteProject = async (req, res) => {
    const {projectId} = req.params;
    console.log("pro id", projectId);
    if (!projectId) {
        return res.status(200).json({"message": "Project Id is Required"});
    }

    try {
        const result = await projectModel.deleteOne({projectId: projectId});
        if (result.deletedCount === 1) {
            return res.status(200).json({"message": "Project deleted"});
        } else if (result.deletedCount === 0) {
            return res.status(200).json({"message": "Id not match"});
        }
    } catch (err) {
        return res.status(400).json({"message": err.message});
    }
}

//api to list the details of projects which are not tagged into a portfolio

exports.notAssignedProjects = async (req, res) => {
  await  projectModel.find({portfolioId: {$exists: false}})
        .then(projects => {
            res.status(200).json({"data": projects});
        })
        .catch(error => {
            res.status(400).json({"error": error.message});
        });
};


// exports.tagPortfolio = async (req, res) => {
//     const {projectId} = req.params;
//     const {portfolioId} = req.body;
//
//     // // pro.getIndexes(0)
//     // console.log("pro :",projectId.getIndexes(0));
//
//     if (!projectId || !portfolioId) {
//         return res.status(200).json({"Message": "portfolioId Id And Project Id is required"})
//     }
//     projectModel.findOneAndUpdate({projectId: projectId}, {portfolioId}, {new: true})
//         .then(async updatedProject => {
//             if (updatedProject) {
//
//                 const updatedPortfolio = await portfolioModel.findOneAndUpdate(
//                     {portfolioId},
//                     {$push: {"projectId.ids": {$each: projectId?.ids || []}}},
//                     {new: true}
//                 );
//
//                 // const updatedPortfolio = await portfolioModel.findOneAndUpdate(
//                 //     { portfolioId },
//                 //     { $push: { "projectId.ids": projectId } },
//                 //     { new: true }
//                 // );
//                 console.log("updated port :",updatedPortfolio);
//                 return res.status(200).json({"message": "Portfolio Successfully tagged", "data": updatedProject});
//             } else {
//                 res.status(200).json({"message": 'Project not found.'});
//             }
//         })
//         .catch(error => {
//             res.status(400).json({"error": error.message});
//         });
// };

//Api to tag portfolio
exports.tagPortfolio = async (req, res) => {

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
        else
        {
            projectModel.findOneAndUpdate({projectId: projectId}, {portfolioId}, {new: true})
            res.status(200).json({"message": "Successfully added project IDs to the portfolio", "data": updatedPortfolio});

        }
    } catch (error) {
        res.status(400).send({"error": error.message});
    }


};

//Api to generate id for projects
async function generateId() {
    const lastProjectid = await projectModel.findOne({}, {}, {sort: {projectId: -1}});

    if (lastProjectid) {
        const lastId = lastProjectid.projectId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}

//Api to fetch  project details and task details with the use of aggregation by passing project Id

// exports.aggregateExample = async (req, res) => {
//     const { projectId } = req.body;
//
//     try {
//         const projectDetails = await portfolioModel.aggregate([
//             {
//                 $match: {
//                     'projectId.ids': projectId
//                 }
//             },
//             {
//                 $unwind: '$projectId.ids'
//             },
//             {
//                 $match: {
//                     'projectId.ids': projectId
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'tasks',
//                     localField: 'projectId.ids',
//                     foreignField: 'projectId',
//                     as: 'tasks',
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


exports.getById = async (req, res) => {
    try {

        const { projectId } = req.body;
        console.log(projectId)
        if(!projectId){
            return res.status(200).json({message:"project Id not found"})
        }

        const project = await projectModel.aggregate([
            {
                $match: { projectId }
            },
            {
                $lookup: {
                    from: "portfolios",
                    localField: "projectId",
                    foreignField: "projectId.ids",
                    as: "portfolio"
                }
            },
            {

                $unwind: { path: "$portfolio", preserveNullAndEmptyArrays: true }
                // $unwind: "$portfolio"
            },
            {
                $lookup: {
                    from: "tasks",
                    localField: "projectId",
                    foreignField: "projectId",
                    as: "tasks"
                }
            },
            {
                $project: {
                    _id: 1,
                    projectId: 1,
                    status: 1,
                    projectName: 1,
                    projectDescription: 1,
                    projectDuration: 1,
                    projectOwner: 1,
                    projectedStartDate: 1,
                    projectedCompletionDate: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1,
                    tasks: {
                        taskId: 1,
                        taskName: 1
                    },portfolio:{
                        portfolioId: "$portfolio.portfolioId",
                        portfolioName: "$portfolio.portfolioName"
                    }
                }
            }
        ]);

        if (project.length === 0) {
            return res.status(200).json({ message: 'Project not found' });
        }

        res.status(200).json({ project: project[0] });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

    //Api to list the projects with pagination

exports.getWithPagination= async (req, res) => {
        const { page , limit } = req.body;
    if(!page || !limit){
        return res.status(200).json({message:"page and limit not found"})
    }
console.log("page ",page," ",limit)
        try {
            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
            };

            const projects = await projectModel.paginate({}, options);

            return res.status(200).json({"data":projects});
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: error.message });
        }
    }


exports.multipleProjectDelete = async (req, res) => {
    try {
        const deleted=[];
        const notDeleted=[];
        // const  projectIds =[];
      const projectIds=req.params.projectIds
            .replace('[', '')
            .replace(']', '')
            .split(',');
      if(!projectIds){
          return res.status(200).json({message:"project Id not found"})
      }
        // projectIds.push(...req.params.projectIds.split(','));
        console.log("path ",projectIds)
        // Delete tasks matching the given task IDs
        for(let i=0; i<projectIds.length; i++) {
            const result = await projectModel.deleteOne({projectId: projectIds[i]});

            if(result.deletedCount===1){
                console.log(i ,"th position, deleted :", projectIds[i]);
                deleted.push(projectIds[i]);
            }
            else if(result.deletedCount===0){
                console.log(i ,"th position ,not deleted :", projectIds[i]);
                notDeleted.push( projectIds[i]);
                console.log("not deleted :", notDeleted[i]);
            }
        }
        if (notDeleted.length===0) {
            res.status(200).json({
                message: 'Project deleted successfully.'
            });
        } else {
            console.log("nottt ",notDeleted)
            res.status(200).json({
                message: 'Some Project IDs not found in the database.',
                missingTaskIds: notDeleted,
                deleted:deleted
            });

        } }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error deleting projects.' });
    }
};





