var express=require('express');
const User=require("../../database/schema");
const mongoose=require("mongoose");
const indexget=(req,res)=>{
    return res.render("index");
}
const doctorpageget=(req,res)=>{
    return res.render("doctor");
}

const hospitalpageget=(req,res)=>{
    return res.render("hospital");
}

const treatmentpageget=(req,res)=>{
    return res.render("treatment");
}
const aboutpageget=(req,res)=>{
    return res.render("aboutUs");
}

const otpnumberpageget=(req,res)=>{
    return res.render("otpnumber");
}

const otpenterpageget=(req,res)=>{
    return res.render("otpenter");
}


module.exports={
    indexget:indexget,
    doctorpageget:doctorpageget,
    hospitalpageget:hospitalpageget,
    treatmentpageget:treatmentpageget,
    aboutpageget:aboutpageget,
    otpnumberpageget:otpnumberpageget,
    otpenterpageget:otpenterpageget,
    

}