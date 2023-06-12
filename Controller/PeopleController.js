
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
        const peopleid = await generatePeopleId();
        people.peopleid=peopleid;


      const save= await peopleModel.create(people);

        res.status(201).json({ "Saved" :save});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


async function generatePeopleId() {
    const lastPeopleid = await peopleModel.findOne({}, {}, { sort: { peopleid: -1 } });

    if (lastPeopleid) {
        const lastId = lastPeopleid.peopleid
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
    const peopleid = req.body.peopleid;
    if(!peopleid){
        return res.status(400).json({"error":"people id not found"});

    }
    const existingPeople=await peopleModel.findOne({peopleid:peopleid})
    console.log("body",existingPeople  )

    if (existingPeople) {
        try{
            console.log("exists")

       const update=     await peopleModel.findByIdAndUpdate(existingPeople._id, req.body)
            return res.status(200).json({"updated": update})

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

exports.deletePeople=async (req,res)=>{
    const peopleid = req.body.peopleid;
    // console.log("people Id ",peopleid)
    // const existingPeople = await peopleModel.findOne({ peopleid: peopleid });
// console.log(existingPeople)
    if (!peopleid) {
        console.log("not exists")
        return res.status(202).json({ message: "People Id is Required" });
    }

    try {console.log(" exists")
        const result = await peopleModel.deleteOne({ peopleid: peopleid });
        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Person deleted" });
        } else {
            return res.status(500).json({ message: "not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}