const projectModel = require("../Models/Project");
const bcrypt=require('bcrypt')

const controller = require('./AuthController');
const express = require("express");
const jwtAuth = require('../Middleware/jwtAuth');
const peopleModel = require("../Models/People");
const e = require("express");
const taskModel = require("../Models/Task");
const router = express.Router();

exports.addProject= async (req, res) => {
    jwtAuth.authenticateToken(req, res, async (error) => {
        if (error) {
            return res.status(401).json({ error: 'Token not valid' });
        }
        const { role } = req.user;
        console.log(role);
        if (role === 'User') {
            return res.status(400).json("Access Denied");
        } else {
            try {
                // const latestProject = await projectModel.findOne({}, {}, { sort: { projectId: -1 } });

                // Increment the ID by 1
                const projectId = await generateId();

                const save={

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
                console.log('projecttttttttttttttttt');
                save.projectId=projectId;


           const saved=     await projectModel.create(save);

                return res.status(200).json({ "Message":"Project Saved Successfully","Data": saved });
            } catch (error) {
                console.error('Error saving project:', error);
                return res.status(400).json({ 'Error saving project': error.message });
            }
        }
    });
};

exports.getAll= async (req,res)=>{

    try {
        const getAll= await projectModel.find()
        return res.status(200).json(getAll)
    }
    catch (error){
        return res.status(400).json({error:error});
    }
};

// exports.update= async (req,res)=>{
//
//     const projectId = req.body.projectId;
//     if(!projectId){
//         return res.status(400).json({"error":"Project Id is null"});
//
//     }
//     const existingProject=await projectModel.findOne({projectId:projectId})
//     console.log("body",existingProject  )
//
//     if (existingProject) {
//         try{
//             console.log("exists")
//             console.log(existingProject.projectedStartDate)
//             console.log(req.body.projectedStartDate)
//
//
//         const update=    await projectModel.findByIdAndUpdate(existingProject._id, req.body)
//             return res.status(200).json({"Message":"Project Updated Successfully","Data":update})
//
//         }
//         catch (error){
//             return res.status(400).json({error:error.message});
//         }
//     }
//     else
//     {
//         // await projectModel.create({email, firstname,lastname, phone,gender} );
//         return res.status(200).json({message: "project not found"})
//     }
//
//
// };


exports.update = async (req, res) => {
    const projectId = req.body.projectId;
    console.log("projectID",projectId)
    if (!projectId) {
        return res.status(400).json({ "error": "Project Id is null" });
    }

    try {
        const update = await peopleModel.updateOne(
            { peopleId: peopleId },
            { $set: req.body },
            { new: false, upsert: false }
        );
        if (update) {
            return res.status(200).json({ "Message": "Project Updated Successfully" });
        } else {
            return res.status(200).json({ "message": "No record found" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};



exports.getById= async (req,res)=>{

    const projectId = req.body;
    if(!projectId){
        return res.status(400).json({error:"Project Id is Required"})
    }
    const existingProject=await projectModel.findOne({projectId:projectId})
    console.log("body",existingProject  )
    console.log("Id",projectId  )

    if (existingProject) {
        try{
            console.log("exists")

            // await projectModel.findByIdAndUpdate(existingProject._id, req.body)
            return res.status(200).json({existingProject})

        }
        catch (error){
            return res.status(400).json({error:error});
        }
    }
    else
    {
        // await projectModel.create({email, firstname,lastname, phone,gender} );
        return res.status(200).json({message: "project not found"})
    }


};


exports.deleteProject = async (req, res) => {
    const {projectId} = req.params;
    console.log("pro id", projectId);
    if (!projectId) {
        return res.status(400).json({ error: "Project Id is Required" });
    }

    try {
        const result = await projectModel.deleteOne({projectId:projectId});
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Project deleted" });
        } else if (result.deletedCount === 0) {
            return res.status(400).json({ message: "Id not match" });
        }
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}


exports.notAssignedProjects=async (req, res) => {
    projectModel.find({ portfolioId: { $exists: false } })
        .then(projects => {
            res.status(200).json({"data":projects});
        })
        .catch(error => {
            res.status(500).json({ "error": error.message });
        });
};


exports.tagPortfolio= async (req, res) => {
    const { projectId } = req.params;
    const { portfolioId } = req.body;

    if(!projectId || !portfolioId){
        return res.status(200).json({"Message":"portfolioId Id And Project Id is required"})
    }
    projectModel.findOneAndUpdate({ projectId: projectId }, { portfolioId }, { new: true })
        .then(updatedProject => {
            if (updatedProject) {
               return  res.status(200).json({"message":"Portfolio Successfully tagged","data":updatedProject});
            } else {
                res.status(200).json({ "message": 'Project not found.' });
            }
        })
        .catch(error => {
            res.status(400).json({ "error": error.message });
        });
};

async function generateId() {
    const lastProjectid = await projectModel.findOne({}, {}, { sort: { projectId: -1 } });

    if (lastProjectid) {
        const lastId = lastProjectid.projectId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}





