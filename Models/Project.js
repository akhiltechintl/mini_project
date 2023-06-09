const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const projectSchema = new Schema({
        projectId: { type: String, required: true },
        status: { type: String, required: true },
        projectName: { type: String, required: true },
        projectDescription: { type: String, required: true },
        projectDuration: { type: Number, required: true },
        portfolioId: { type: String },
        projectOwner: {
            _id: { type: String, required: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
        },
        projectedStartDate: {
             type: Date, required: true },
        projectedCompletionDate: {
            type: Date, required: true
        },
    },
    {timestamps:true}
);

projectSchema.plugin(mongoosePaginate);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
