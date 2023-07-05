const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

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
        ]
    },

},
    {timestamps:true}
);

portfolioSchema.plugin(mongoosePaginate);

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
