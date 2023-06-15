const taskModel = require("../Models/Task");

exports.addTask = async (req, res) => {

    try {
        const taskId = await generateId();
        console.log("task id", taskId)

        const task = {
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

        task.taskId = taskId;


        const save = await taskModel.create(task);

        return res.status(200).json({"Message": "Task Saved Successfully", "Data": save});
    } catch (error) {
        return res.status(400).json({"error": error.message});
    }

};


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
            return res.status(200).json({"Message": "Task Updated Successfully"});
        } else {
            return res.status(200).json({"message": "No record found"});
        }
    } catch (error) {
        return res.status(400).json({"error": error.message});
    }
};


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


exports.getAll = async (req, res) => {
    const getAll = await taskModel.find();
    return res.status(200).json({"message": "Successfully called get", "data": getAll});
}


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


async function generateId() {
    const lastTaskId = await taskModel.findOne({}, {}, {sort: {taskId: -1}});

    if (lastTaskId) {
        const lastId = lastTaskId.taskId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}

