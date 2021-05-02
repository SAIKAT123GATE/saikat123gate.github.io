var express=require("express");
const docdetails=require("../../database/docdetails");
var mongoose=require("mongoose");
const docdetailsget=(req,res)=>{
   return res.render("doctordetails");
}

const docdetailsregister= async (req,res)=>{
    const {description,hospitals,achievements,exp,qualification,awards,specialization,fees}=req.body;
    try{
    const user= new docdetails({description,hospitals,achievements,exp,qualification,awards,specialization,fees});
    const register= await user.save();
    if(register){
        console.log("saved successfully");
        return res.redirect("/index");
    }
}
    catch(err){
        console.log(err);
        return res.redirect("/docdetails");
    }
}

module.exports={
    docdetailsget:docdetailsget,
    docdetailsregister:docdetailsregister
}