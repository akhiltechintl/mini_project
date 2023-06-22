const mongoose = require('mongoose');

const { Schema } = mongoose;

const taskSchema = new Schema({
        taskId: { type: String, required: false },
        status: { type: String, required: true },
        assignee: {
            _id: { type: String},
            name: { type: String},
            email: { type: String},
        },
        planHours: { type: String, required: true },
        duration: { type: Number, required: true },
        startOn: { type: String, required: true },
        dueOn: { type: String, required: true },
        taskName: { type: String, required: true },
        description: { type: String, required: true },
        createdBy: {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
        projectId: { type: String },
    },
    {timestamps:true}
);


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;