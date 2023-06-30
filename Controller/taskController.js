const taskModel = require("../Models/Task");
const projectModel = require("../Models/Project");


//Api to add task
exports.addTask = async (req, res) => {

    try {
        const taskId = await generateId();
        console.log("task id", taskId)

        const task = {assignee,
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
            return res.status(200).json({"Message": "Task Updated Successfully","data":update});
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

//Api to get All task
exports.getAll = async (req, res) => {
    const getAll = await taskModel.find();
    return res.status(200).json({"message": "Successfully called get", "data": getAll});
}

// Api to add an assignee to a task
// exports.addAssignee = (req, res) => {
//     const {taskId} = req.params;
//     const {assignee} = req.body;
//
//     if (!taskId || !assignee) {
//         return res.status(200).json({"Message": "Task Id And Assignee Id is required"})
//     }
//     taskModel.findOneAndUpdate({taskId: taskId}, {assignee}, {new: true})
//         .then(updatedTask => {
//             if (updatedTask) {
//                 return res.status(200).json({"message": "Assignee Successfully tagged to Task", "data": updatedTask});
//             } else {
//                 res.status(200).json({"message": 'Task not found.'});
//             }
//         })
//         .catch(error => {
//             res.status(400).json({"error": error.message});
//         });
// };

//api to get the details of a particular task by passing Project Id
 exports.getTaskById = async (req, res) => {
     try {
         const { projectId } = req.body;
         console.log("projectId", projectId);

         if (!projectId) {
             return res.status(200).json({ "message": "Project Id is Required" });
         }

         const existingProject = await taskModel.find({ projectId: projectId });
         console.log("body", existingProject);

         if (existingProject.length > 0) {
             console.log("exists");
             return res.status(200).json({ "data": existingProject });
         } else {
             return res.status(200).json({ "message": "project not found" });
         }
     } catch (error) {
         return res.status(400).json({ "error": error.message });
     }
 };


// exports.multipleTaskDelete = async (req, res) => {
//     try {
//         const { taskIds } = req.body;
//         console.log(taskIds.length);
//         // Delete tasks matching the given task IDs
//         const result = await taskModel.deleteMany({ taskId: { $in: taskIds } });
//
//         const { n, deletedCount } = result;
//         console.log("result ", result);
//
//         if (n === taskIds.length && n === deletedCount) {
//             console.log("entered if");
//             res.status(200).json({ message: 'Tasks deleted successfully.' });
//         } else {
//             const deletedTaskIds = taskIds.filter((taskId) => {
//                 return (
//                     result.deletedCount &&
//                     result.deletedCount > 0 &&
//                     result.deletedCount === n &&
//                     !result.writeErrors.some((err) => err.op.taskId === taskId)
//                 );
//             });
//
//             const missingTaskIds = taskIds.filter(
//                 (taskId) => !deletedTaskIds.includes(taskId)
//             );
//
//             res.status(404).json({
//                 message: 'One or more task IDs not found in the database.',
//                 missingTaskIds,
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting tasks.' });
//     }
// };

exports.multipleTaskDelete = async (req, res) => {
    try {
        const deleted=[];
        const notDeleted=[];
        const { taskIds } = req.body;
        console.log("taskIds ", taskIds[0]);
        // Delete tasks matching the given task IDs
        for(let i=0;i<taskIds.length;i++) {
            const result = await taskModel.deleteOne({taskId: taskIds[i]});

          if(result.deletedCount===1){
              console.log(i ,"th position, deleted :", taskIds[i]);
              deleted.push(taskIds[i]);
          }
            else if(result.deletedCount===0){
              console.log(i ,"th position ,not deleted :", taskIds[i]);
                notDeleted.push( taskIds[i]);
              console.log("not deleted :", notDeleted[i]);
          }
        }
        if (notDeleted.length===0) {
            res.status(200).json({
                message: 'Tasks deleted successfully.'
            });
        } else {
            console.log("nottt ",notDeleted)
            res.status(400).json({
                message: 'Some task IDs not found in the database.',
                missingTaskIds: notDeleted,
                deleted:deleted
            });

    } }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting tasks.' });
    }
};

exports.getById = async (req, res) => {
    try {
        const {taskId} = req.body;
if(!taskId){
    return res.status(400).json({message:"task Id not found"})
}
        // Fetch the task with the provided taskId
        const task = await taskModel.aggregate([
            {
                $match: { taskId: taskId }
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
            return res.status(200).json({ message: 'Task not found' });
        }

        res.status(200).json({data:task});
    } catch (error) {
        res.status(400).json({ error: error.message });
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