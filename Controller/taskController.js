
const taskModel = require("../Models/Task");
const express = require("express");
const jwtAuth = require('../Middleware/jwtAuth');
const projectModel = require("../Models/Project");
const e = require("express");
const router=express.Router();


router.post('/add-task', async (req, res) => {

        try
        {
                const latestTask = await taskModel.findOne({}, {}, { sort: { taskid: -1 } });

                // Increment the ID by 1
                const taskid = latestTask ? latestTask.taskid + 1 : 1;

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

    });


router.post("/update-task", async (req,res)=>{

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


});

router.post("/delete-task",async (req,res)=>{
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
})

module.exports = router;