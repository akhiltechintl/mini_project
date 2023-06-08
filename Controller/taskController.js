
const taskModel = require("../Models/Task");
const express = require("express");
const jwtAuth = require('../Middleware/jwtAuth');
const projectModel = require("../Models/Project");
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

module.exports = router;