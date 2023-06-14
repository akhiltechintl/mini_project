
const peopleModel = require("../Models/People");
const express = require("express");
const e = require("express");
const projectModel = require("../Models/Project");
const router=express.Router();


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

        res.status(201).json({"Message":"Saved Successfully","Data":save});
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};


async function generatePeopleId() {
    const lastPeopleid = await peopleModel.findOne({}, {}, { sort: { peopleId: -1 } });

    if (lastPeopleid) {
        const lastId = lastPeopleid.peopleId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}

exports.getPeople = async (req, res) => {
    try {

        const getAll=await peopleModel.find();
        return res.status(200).json({body:getAll})
}catch (error){
        return res.status(400).json({error:error});
    }
};

exports.updatePeople=async (req,res)=>{
    const peopleId = req.body.peopleId;
    if(!peopleId){
        return res.status(400).json({"error":"people id not found"});

    }
    const existingPeople=await peopleModel.findOne({peopleId:peopleId})
    console.log("body",existingPeople  )

    if (existingPeople) {
        try{
            console.log("exists")

       const update=     await peopleModel.findByIdAndUpdate(existingPeople._id, req.body)
            return res.status(200).json({"Message":"Updated Successfully","Data":update})

        }
        catch (error){
            return res.status(400).json({error:error});
        }
    }
    else
    {
        // await projectModel.create({email, firstname,lastname, phone,gender} );
        return res.status(200).json({message: "not found"})
    }


}


// Assuming you have defined your people schema and model

// Define your route
exports.getAssignee=async (req, res) => {
    // Find users with accesslevel as 'User' and project only the required fields
    try {
        // Find users with accesslevel as 'User' and project only the required fields
        const users = await peopleModel.find({ accesslevel: 'User' }).select('name peopleId');

        // Send the response with the users data
        res.json({ message: 'Users successfully fetched', users: users });
    } catch (err) {
        console.error('Failed to fetch users:', err);
        res.status(400).json({ message: err.message });
    }
};


exports.deletePeople=async (req,res)=>{
    const peopleId = req.params.peopleId;
    console.log(peopleId)
    // console.log("people Id ",peopleid)
    // const existingPeople = await peopleModel.findOne({ peopleid: peopleid });
// console.log(existingPeople)
    if (!peopleId) {
        console.log("not exists")
        return res.status(200).json({ message: "People Id is Required" });
    }

    try {console.log(" exists")
        const result = await peopleModel.deleteOne({peopleId: peopleId} );
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Person deleted" });
        } if(result.deletedCount === 0) {
            return res.status(400).json({ message: "Id doesn't match" });
        }
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}