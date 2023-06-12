const portfolioModel = require("../Models/Portfolio");
const express = require("express");
const projectModel = require("../Models/Project");

exports.addPortfolio=async (req,res)=>{
  try {


      const portfolioid = await generateId();
      const {
          portfolioDescription,
          status,
          portfolioManager,
          portfolioName,
          projectId
      } = req.body;

      await portfolioModel.create({
          portfolioid,
          portfolioDescription,
          status,
          portfolioManager,
          portfolioName,
          projectId

      })
      return res.status(200).json({"message":"Portfolio Added Successfully"})

  }
  catch (error){
      return res.status(400).json({"error":error.message})
  }
};

exports.getAll=async (req,res) => {
    try {
        const findAll = await portfolioModel.find();
        console.log(findAll)
        return res.status(200).json({findAll});
    } catch (error) {
        res.send(400).json({"error": error.message})
    }
}
exports.updatePortfolio=async (req,res)=>{
    const portfolioid=req.body.portfolioid;
    const existingPortfolio=await portfolioModel.exists({portfolioid:portfolioid})
    if(!existingPortfolio){
        return res.status(400).json({message:"Portfolio Not Found"})
    }
    try {
        await portfolioModel.findByIdAndUpdate(existingPortfolio._id,req.body)
        return res.status(200).json({message:"Portfolio Updated Successfully"})
    }
    catch (error){
        return res.status(400).json({"error":error.message})
    }
}

exports.deletePortfolio=async (req,res)=>{
    const portfolioid=req.body.portfolioid;
    if(!portfolioid){
        return res.status(400).json({"error":"Portfolio id is required to perform this action"})
    }
    try{
    const deleted=   await portfolioModel.deleteOne({portfolioid:portfolioid})
        if(deleted.deletedCount===1){
        return res.status(200).json({"message":"deleted"})
    }else {
            return res.status(400).json({"message":"Portfolio not found"})

        }
    }catch (error){
        return res.status(400).json({"error":error.message})

    }
}

exports.updateProject=async (req,res)=> {
    try {

        const newProjectid = req.body.projectId;
        if(!newProjectid){
            return res.status(400).json({"error": "Project Id is required"})

        }
        const portfolioid = req.body.portfolioid;
        const exist = await portfolioModel.findOne({porfolioid: portfolioid})
        if (!exist) {
            return res.status(400).json({"error": "Portfolio not found"})
        }
        else {


            exist.projectId=req.body.projectId;
            console.log("existssssssss")
            console.log(exist.projectId)
           await exist.save();
           // await portfolioModel.findByIdAndUpdate(exist._id,exist)
            return res.status(200).json({"message": "Project added to portfolio"})
        }
    }
    catch (error){
        return res.status(400).json({"error":error.message})
    }
}



async function generateId() {
    const lastPortfolioid = await portfolioModel.findOne({}, {}, { sort: { portfolioid: -1 } });

    if (lastPortfolioid) {
        const lastId = lastPortfolioid.portfolioid
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}