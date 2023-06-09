const projectModel = require("../Models/Project");
const bcrypt=require('bcrypt')

const controller = require('./AuthController');
const express = require("express");
const jwtAuth = require('../Middleware/jwtAuth');
const router = express.Router();

exports.addProject= async (req, res) => {
    jwtAuth.authenticateToken(req, res, async (error) => {
        if (error) {
            return res.status(401).json({ error: 'Token not valid' });
        }
        const { role } = req.user;
        console.log(role);
        if (role === 'User') {
            return res.send('Access Denied');
        } else {
            try {
                const latestProject = await projectModel.findOne({}, {}, { sort: { projectid: -1 } });

                // Increment the ID by 1
                const projectid = latestProject ? latestProject.projectid + 1 : 1;

                const {

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
                console.log({
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
                });

                await projectModel.create({
                    projectid,
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
                });

                return res.status(200).json({ message: 'Project saved successfully' });
            } catch (error) {
                console.error('Error saving project:', error);
                return res.status(401).json({ error: error });
            }
        }
    });
};

exports.getAll= async (req,res)=>{

    try {
        const getAll= await projectModel.find()
        return res.status(200).json({body:getAll})
    }
    catch (error){
        return res.status(400).json({error:error});
    }
};

exports.update= async (req,res)=>{

    const {projectid} = req.body;
    const existingProject=await projectModel.findOne({projectid:projectid})
    console.log("body",existingProject  )

    if (existingProject) {
        try{
            console.log("exists")

            await projectModel.findByIdAndUpdate(existingProject._id, req.body)
            return res.status(200).json({message: "project updated successfully"})

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

exports.getById= async (req,res)=>{

    const {projectid} = req.body;
    const existingProject=await projectModel.findOne({projectid:projectid})
    console.log("body",existingProject  )
    console.log("Id",projectid  )

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


exports.deleteProject=async (req,res)=>{
    const projectid = req.body.projectid;
    const existingProject = await projectModel.findOne({ projectid: projectid });

    if (!existingProject) {
        return res.status(202).json({ message: "No Project Found With This Project Id" });
    }

    try {
        const result = await projectModel.deleteOne({ _id: existingProject._id });
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Project deleted" });
        } else {
            return res.status(500).json({ message: "Deletion failed" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Deletion failed" });
    }
}







