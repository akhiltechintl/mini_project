
const peopleModel = require("../Models/People");
const express = require("express");
const e = require("express");
const projectModel = require("../Models/Project");
const router=express.Router();



//Adding People To DB
exports.addPeople = async (req, res) => {
    try {
        console.log("called add People");

        const people={
            name,
            isActive,
            email,
            phone,
            address,
            accesslevel,
            jobInfo,
            createdByID
        }= req.body;

        // Generate unique portfolioId
        const peopleId = await generatePeopleId();
        people.peopleId=peopleId;


      const save= await peopleModel.create(people);

        res.status(200).json({"Message":"Saved Successfully","Data":save});
    } catch (error) {
        res.status(400).json({ "message": error.message });
    }
};

//Function To Generate PeopleId
async function generatePeopleId() {
    const lastPeopleid = await peopleModel.findOne({}, {}, { sort: { peopleId: -1 } });

    if (lastPeopleid) {
        const lastId = lastPeopleid.peopleId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}

//API To Get-All People
exports.getPeople = async (req, res) => {
    try {

        const getAll=await peopleModel.find();
        return res.status(200).json({"data":getAll})
}catch (error){
        return res.status(400).json({error:error});
    }
};





exports.updatePeople = async (req, res) => {
    const peopleId = req.body.peopleId;
    console.log("peopleId", peopleId);
    if (!peopleId) {
        return res.status(200).json({ "message": "People Id is null" });
    }

    try {
        const update = await peopleModel.updateOne(
            { peopleId: peopleId },
            { $set: req.body },
            { new: true, upsert: false }
        );

        if (update.modifiedCount > 0 && update.matchedCount > 0) {
                return res.status(200).json({ "message": "People Updated Successfully" });
            } else {
                return res.status(200).json({ "message": "No Record Found" });
            }

    } catch (error) {
        return res.status(400).json({ "error": error.message });
    }
};






exports.getAssignee=async (req, res) => {
    try {
        const users = await peopleModel.find({ accesslevel: 'User' }).select('name peopleId');
      return   res.status.json({ message: 'successfully fetched users', users: users });
    } catch (err) {
        console.error('Failed to fetch users:', err);
       return  res.status(400).json({ message: err.message });
    }
};


exports.deletePeople=async (req,res)=>{
    const peopleId = req.params.peopleId;
    console.log(peopleId)
    if (!peopleId) {
        console.log("not exists")
        return res.status(200).json({ message: "People Id is Required" });
    }

    try {console.log(" exists")
        const result = await peopleModel.deleteOne({peopleId: peopleId} );
        if (result.deletedCount === 1) {
            return res.status(200).json({ "message": "Person deleted" });
        } if(result.deletedCount === 0) {
            return res.status(200).json({ "message": "Id doesn't match" });
        }
    } catch (err) {
        return res.status(400).json({ "error": err.message });
    }
}