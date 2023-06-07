const projectModel = require("../Models/Project");
const bcrypt=require('bcrypt')

const controller = require('./AuthController');
const express = require("express");
const jwtAuth = require('../Middleware/jwtAuth');
const router = express.Router();

router.post('/add-project', async (req, res) => {
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
                const {
                    _id,
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
                    _id,
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
                    _id,
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
                return res.status(400).json({ error: "Duplicate Project Found" });
            }
        }
    });
});

router.post("/get/all", async (req,res)=>{

 try {
     const getAll= await projectModel.find()
     return res.status(200).json({body:getAll})
 }
 catch (error){
     return res.status(400).json({error:error});
 }
});

router.post("/update", async (req,res)=>{

    const {_id} = req.body;
    const existingProject=await projectModel.findOne({_id:_id})
    console.log("body",existingProject  )

    if (existingProject){
        await projectModel.findByIdAndUpdate(existingProject._id,req.body)
        return res.status(200).json({message:"project updated successfully"})

    }
    else {
        // await projectModel.create({email, firstname,lastname, phone,gender} );
        return res.status(200).json({message:"project not found"})
    }
});

router.post("/delete/project",async (req,res)=>{
    const id = req.body._id;
    const existingProject = await projectModel.findOne({ _id: id });

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
})

module.exports = router;