var express = require("express");
const User = require("../database/schema");
const mongoose = require("mongoose");
const docdetails = require("../database/docdetails");
const schedules = require("../database/appointment");
const medicalreport = require("../database/medicalreport");
const bookings=require("../database/booking");
const multer=require('multer');

const admindashboard=async(req,res)=>{
    return res.render("admindashboard");
}

const adminusers=async(req,res)=>{
    return res.render("adminusers");
}

const admindoctors=async(req,res)=>{
    return res.render("admindoctors");
}


const adminhospitals=async(req,res)=>{
    return res.render("adminhospitals");
}
module.exports={
    admindashboard:admindashboard,
    adminusers:adminusers,
    admindoctors:admindoctors,
    adminhospitals:adminhospitals
}