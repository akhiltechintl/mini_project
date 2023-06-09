const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const { Schema } = mongoose;

const peopleSchema = new Schema({
        peopleId: { type: String, required: true },
        name: { type: String, required: true },
        isActive: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: Number, required: true },
        address: { type: String, required: true },
        accesslevel: { type: String, required: true },
        jobInfo: { type: String, required: true },
        createdByID: { type: String, required: true },
    },
    {timestamps:true}
);
peopleSchema.plugin(mongoosePaginate);

const People = mongoose.model('People', peopleSchema);

module.exports = People;
