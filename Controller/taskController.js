const taskModel = require("../Models/Task");
const projectModel = require("../Models/Project");


//Api to add task
exports.addTask = async (req, res) => {

    try {
        const taskId = await generateId();
        console.log("task id", taskId)

        const task = {
            assignee,
            status,
            planHours,
            duration,
            startOn,
            dueOn,
            taskName,
            description,
            createdBy,
            projectId
        } = req.body;
        console.log("assignee", assignee)
        task.taskId = taskId;


        const save = await taskModel.create(task);

        return res.status(200).json({"Message": "Task Saved Successfully", "Data": save});
    } catch (error) {
        return res.status(400).json({"error": error.message});
    }

};

//Api to update task details
exports.updateTask = async (req, res) => {
    const taskId = req.body.taskId;
    console.log("taskId", taskId)
    if (!taskId) {
        return res.status(200).json({"message": "Task Id is null"});
    }

    try {
        const update = await taskModel.updateOne(
            {taskId: taskId},
            {$set: req.body},
            {new: false, upsert: false}
        );
        if (update.modifiedCount > 0 && update.matchedCount > 0) {
            return res.status(200).json({"Message": "Task Updated Successfully", "data": update});
        } else {
            return res.status(200).json({"message": "No record found"});
        }
    } catch (error) {
        return res.status(400).json({"error": error.message});
    }
};

//Api to delete task by passing task Id

exports.deleteTask = async (req, res) => {
    const taskId = req.params.taskId;
    if (!taskId) {
        return res.status(200).json({"message": "Task id is required"});
    }

    try {
        const result = await taskModel.deleteOne({taskId: taskId});
        if (result.deletedCount === 1) {
            return res.status(200).json({"message": "Task deleted"});
        }
        if (result.deletedCount === 0) {
            return res.status(200).json({"message": "Task Id not matching"});
        }
    } catch (err) {
        return res.status(400).json({"error": err.message});
    }
}


//api to get the details of a particular task by passing Project Id

exports.multipleTaskDelete = async (req, res) => {
    try {
        const deleted = [];
        const notDeleted = [];
        const {taskIds} = req.body;
        console.log("taskIds ", taskIds[0]);
        // Delete tasks matching the given task IDs
        for (let i = 0; i < taskIds.length; i++) {
            const result = await taskModel.deleteOne({taskId: taskIds[i]});

            if (result.deletedCount === 1) {
                console.log(i, "th position, deleted :", taskIds[i]);
                deleted.push(taskIds[i]);
            } else if (result.deletedCount === 0) {
                console.log(i, "th position ,not deleted :", taskIds[i]);
                notDeleted.push(taskIds[i]);
                console.log("not deleted :", notDeleted[i]);
            }
        }
        if (notDeleted.length === 0) {
            res.status(200).json({
                message: 'Tasks deleted successfully.'
            });
        } else {
            console.log("nottt ", notDeleted)
            res.status(400).json({
                message: 'Some task IDs not found in the database.',
                missingTaskIds: notDeleted,
                deleted: deleted
            });

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error deleting tasks.'});
    }
};

exports.getById = async (req, res) => {
    try {
        const {taskId} = req.body;
        if (!taskId) {
            return res.status(400).json({message: "task Id not found"})
        }
        // Fetch the task with the provided taskId
        const task = await taskModel.aggregate([
            {
                $match: {taskId: taskId}
            },
            {
                $lookup: {
                    from: 'projects',
                    localField: 'projectId',
                    foreignField: 'projectId',
                    as: 'project'
                }
            },
            {
                $unwind: '$project'
            },
            {
                $project: {
                    assignee: 1,
                    createdBy: 1,
                    _id: 1,
                    taskId: 1,
                    status: 1,
                    planHours: 1,
                    duration: 1,
                    startOn: 1,
                    dueOn: 1,
                    taskName: 1,
                    description: 1,
                    'project.projectId': '$project.projectId',
                    'project.projectName': '$project.projectName',
                    createdAt: 1,
                    updatedAt: 1,
                    __v: 1
                }
            }
        ]);

        if (!task || task.length === 0) {
            return res.status(200).json({message: 'Task not found'});
        }

        res.status(200).json({data: task});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

//Api to generate id for task

async function generateId() {
    const lastTaskId = await taskModel.findOne({}, {}, {sort: {taskId: -1}});

    if (lastTaskId) {
        const lastId = lastTaskId.taskId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}

// exports.addAssignee = (req, res) => {
//     const { taskId } = req.params;
//     const { assignee } = req.body;
//
//     if (!taskId || !assignee) {
//         return res.status(200).json({ "Message": "Task Id and Assignee Id are required" });
//     }
//
//     taskModel.findOneAndUpdate({ taskId: taskId }, { $push: { assignee: { $each: assignee } } }, { new: true })
//         .then(updatedTask => {
//             if (updatedTask) {
//                 return res.status(200).json({ "message": "Assignees successfully added to the task", "data": updatedTask });
//             } else {
//                 res.status(200).json({ "message": 'Task not found.' });
//             }
//         })
//         .catch(error => {
//             res.status(400).json({ "error": error.message });
//         });
// };

exports.addAssignee = (req, res) => {
    const {taskId} = req.params;
    const {assignee} = req.body;

    if (!taskId || !assignee) {
        return res.status(200).json({"Message": "Task Id And Assignee Id is required"})
    }
    taskModel.findOneAndUpdate({taskId: taskId}, {assignee}, {new: true})
        .then(updatedTask => {
            if (updatedTask) {
                return res.status(200).json({"message": "Assignee Successfully tagged to Task", "data": updatedTask});
            } else {
                res.status(200).json({"message": 'Task not found.'});
            }
        })
        .catch(error => {
            res.status(400).json({"error": error.message});
        });
};

exports.getTaskList = async (req, res) => {
    try {
        // Fetch projects from the database (assuming you're using Mongoose)
        const tasks = await taskModel.find();
        console.log("table:", tasks)

        // Render the project.ejs file with the projects data
        res.render('task', {tasks});
    } catch (error) {
        // Handle error appropriately
        res.status(400).send(error.message);
    }
};

exports.listAllTask = async (req, res) => {
    const {page, limit} = req.body;
    const skip = (page - 1) * limit;
    console.log("page and limit")
    console.log(page, limit)
    if (!page || !limit) {
        return res.status(200).json({message: "page and limit not found"})
    }
    console.log("page ", page, " ", limit)
    try {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const tasks = await taskModel.find().skip(skip).limit(limit);
        // const tasks = await taskModel.paginate({}, options);

        return res.status(200).json({"data": tasks});
    } catch (error) {
        console.error(error);
        return res.status(400).json({error: error.message});
    }
}