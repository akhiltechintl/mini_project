
const taskModel = require("../Models/Task");
const express = require("express");
const jwtAuth = require('../Middleware/jwtAuth');
const projectModel = require("../Models/Project");
const e = require("express");
const {update} = require("./ProjectController");
const router=express.Router();


exports.addTask= async (req, res) => {

        try
        {


                // Increment the ID by 1
                const taskId =await generateId();
                console.log("task id", taskId)

            const task= {
                status,
                assignee,
                planHours,
                duration,
                startOn,
                dueOn,
                taskName,
                description,
                createdBy,
                projectId
            } = req.body;

                task.taskId=taskId;


         const save=       await taskModel.create(task);

                return res.status(200).json({ "Message":"Task Saved Successfully","Data":save});
            } catch (error) {
                console.error('Error saving project:', error);
                return res.status(400).json({ error: error.message });
            }

    };


exports.updateTask= async (req,res)=>{

    const {taskId} = req.body;
    console.log("taask id",taskId)
    if(!taskId){
        return res.status(400).json({"error":"Task id is null"});

    }
    const existingTask=await taskModel.findOne({taskId:taskId})
    console.log("body",existingTask  )

    if (existingTask) {
        try{
            console.log("exists")

      const updated=      await taskModel.findByIdAndUpdate(existingTask._id, req.body)
            return res.status(200).json({"Message":"Task Updated Successfully","Data":updated})

        }
        catch (error){
            return res.status(400).json({error:error});
        }
    }
    else
    {
        // await projectModel.create({email, firstname,lastname, phone,gender} );
        return res.status(200).json({message: "Task not found"})
    }


};

exports.deleteTask= async (req,res)=>{
    const taskId = req.params.taskId;
//     const existingTask = await taskModel.findOne({ taskId: taskId });
// console.log(taskId)
    if (!taskId) {
        console.log("!ex ",taskId)
        return res.status(400).json({ message: "Task id is required" });
    }

    try {
        // console.log("exist ",existingTask)
        const result = await taskModel.deleteOne({ taskId: taskId });
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Task deleted" });
        } if(result.deletedCount === 0) {
            return res.status(400).json({ message: "Task Id not matching" });
        }
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

exports.getAll=async (req,res)=>{
    const getAll=await taskModel.find();
    return res.status(200).json({"message":"Successfully called get","data":getAll});
}


const mongoose = require("mongoose");

exports.addAssignee= (req, res) => {
    const { taskId } = req.params;
    const { assignee } = req.body;

    if(!taskId || !assignee){
        return res.status(200).json({"Message":"Task Id And Assignee Id is required"})
    }
    taskModel.findOneAndUpdate({ taskId: taskId }, { assignee }, { new: true })
        .then(updatedTask => {
            if (updatedTask) {
              return   res.status(200).json({"message":"Assignee Successfully tagged to Task","data":updatedTask});
            } else {
                res.status(400).json({ "message": 'Task not found.' });
            }
        })
        .catch(error => {
            res.status(400).json({ "error": error.message });
        });
};


async function generateId() {
    const lastTaskId = await taskModel.findOne({}, {}, { sort: { taskId: -1 } });

    if (lastTaskId) {
        const lastId = lastTaskId.taskId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}

// module.exports = router;