const mongoose = require('mongoose');

const { Schema } = mongoose;

const portfolioSchema = new Schema({
    portfolioId: { type: String },
    portfolioDescription: { type: String, required: true },
    status: { type: String, required: true },
    portfolioManager: {
        _id: { type: String, required: true },
        name: { type: String, required: true },
    },
    portfolioName: { type: String, required: true },
    projectId: {
        ids: [
            { type: String},
            { type: String}
        ]
    },

},
    {timestamps:true}
);



const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
