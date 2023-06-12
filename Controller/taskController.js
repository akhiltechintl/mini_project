
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
                const taskid =await generateId();
                console.log("task id", taskid)

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
                projectid
            } = req.body;

                task.taskid=taskid;


         const save=       await taskModel.create(task);

                return res.status(200).json({ "saved": save});
            } catch (error) {
                console.error('Error saving project:', error);
                return res.status(400).json({ error: error.message });
            }

    };


exports.updateTask= async (req,res)=>{

    const {taskid} = req.body;
    if(!taskid){
        return res.status(400).json({"error":"Task id is null"});

    }
    const existingTask=await taskModel.findOne({taskid:taskid})
    console.log("body",existingTask  )

    if (existingTask) {
        try{
            console.log("exists")

      const updated=      await taskModel.findByIdAndUpdate(existingTask._id, req.body)
            return res.status(200).json({"updated": updated})

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
    const taskid = req.body.taskid;
//     const existingTask = await taskModel.findOne({ taskid: taskid });
// console.log(taskid)
    if (!taskid) {
        console.log("!ex ",taskid)
        return res.status(202).json({ message: "Task id is required" });
    }

    try {
        // console.log("exist ",existingTask)
        const result = await taskModel.deleteOne({ taskid: taskid });
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Task deleted" });
        } else {
            return res.status(500).json({ message: "Deletion failed" });
        }
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function generateId() {
    const lastTaskid = await taskModel.findOne({}, {}, { sort: { taskid: -1 } });

    if (lastTaskid) {
        const lastId = lastTaskid.taskid
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}

// module.exports = router;