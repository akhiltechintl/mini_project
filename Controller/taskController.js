
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

            const {
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

                console.log({
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
                });


                await taskModel.create({
                    taskid,
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
            });

                return res.status(200).json({ message: 'task saved successfully' });
            } catch (error) {
                console.error('Error saving project:', error);
                return res.status(400).json({ error: error });
            }

    };


exports.updateTask= async (req,res)=>{

    const {taskid} = req.body;
    const existingTask=await taskModel.findOne({taskid:taskid})
    console.log("body",existingTask  )

    if (existingTask) {
        try{
            console.log("exists")

            await taskModel.findByIdAndUpdate(existingTask._id, req.body)
            return res.status(200).json({message: "Task updated successfully"})

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
    const existingTask = await taskModel.findOne({ taskid: taskid });
console.log(taskid)
    if (!existingTask) {
        console.log("!ex ",existingTask)
        return res.status(202).json({ message: "No Task Found With Task Id" });
    }

    try {
        console.log("exist ",existingTask)
        const result = await taskModel.deleteOne({ _id: existingTask._id });
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Task deleted" });
        } else {
            return res.status(500).json({ message: "Deletion failed" });
        }
    } catch (err) {
        return res.status(500).json({ error: err });
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