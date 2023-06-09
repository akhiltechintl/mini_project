const mongoose = require('mongoose');

const { Schema } = mongoose;

const projectSchema = new Schema({
        projectid: { type: String, required: true },
        status: { type: String, required: true },
        projectName: { type: String, required: true },
        projectDescription: { type: String, required: true },
        projectDuration: { type: Number, required: true },
        portfolioId: { type: String, required: true },
        projectOwner: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
        projectedStartDate: { type: Date, required: true },
        projectedCompletionDate: { type: Date, required: true },
    },
    {timestamps:true}
);


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
