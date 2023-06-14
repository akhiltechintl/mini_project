const portfolioModel = require("../Models/Portfolio");
const express = require("express");
const projectModel = require("../Models/Project");

exports.addPortfolio=async (req,res)=>{
  try {


      const portfolioId = await generateId();
      const portfolio={
          portfolioDescription,
          status,
          portfolioManager,
          portfolioName,
          projectId
      } = req.body;
      portfolio.portfolioId=portfolioId;

     const save= await portfolioModel.create(portfolio)
      return res.status(200).json({"Message":"Portfolio Saved Successfully","Data":save})

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
    const portfolioId=req.body.portfolioId;
    if(!portfolioId){
        return res.status(400).json({"error":"Portfolio Id Not Found"})

    }
    const existingPortfolio=await portfolioModel.exists({portfolioId:portfolioId})
    if(!existingPortfolio){
        return res.status(400).json({message:"Portfolio Not Found"})
    }
    try {
     const update=   await portfolioModel.findByIdAndUpdate(existingPortfolio._id,req.body)
        return res.status(200).json({"Message":"Portfolio Updated Successfully","Data":update})
    }
    catch (error){
        return res.status(400).json({"error":error.message})
    }
}

exports.deletePortfolio=async (req,res)=>{
    const portfolioId=req.params.portfolioId;
    console.log("portfolio Id ",portfolioId)
    if(!portfolioId){
        return res.status(400).json({"error":"Portfolio id is required to perform this action"})
    }
    try{
    const deleted=   await portfolioModel.deleteOne({portfolioId:portfolioId})
        if(deleted.deletedCount===1){
        return res.status(200).json({"message":"deleted"})
    }if(deleted.deletedCount===0) {
            return res.status(400).json({"message":"Portfolio Id not match"})

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
        const portfolioId = req.body.portfolioId;
        const exist = await portfolioModel.findOne({portfolioId: portfolioId})
        if (!exist) {
            return res.status(400).json({"error": "Portfolio not found"})
        }
        else {


            exist.projectId=req.body.projectId;
            console.log("existssssssss")
            console.log(exist.projectId)
        const update=   await exist.save();
           // await portfolioModel.findByIdAndUpdate(exist._id,exist)
            return res.status(200).json({"Message":"Project updated to portfolio","Data":update})
        }
    }
    catch (error){
        return res.status(400).json({"error":error.message})
    }
}



async function generateId() {
    const lastPortfolioid = await portfolioModel.findOne({}, {}, { sort: { portfolioId: -1 } });

    if (lastPortfolioid) {
        const lastId = lastPortfolioid.portfolioId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}