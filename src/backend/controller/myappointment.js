var express = require("express");
const User = require("../database/schema");
const mongoose = require("mongoose");
const docdetails = require("../database/docdetails");
const schedules = require("../database/appointment");
const medicalreport = require("../database/medicalreport");
const bookings=require("../database/booking");
const multer=require('multer');


//Getting my appointment page
const myappointment=async (req,res)=>{

    if(!req.session.isDoctor){
        var bookingdetails=await bookings.find({email:req.session.email});
        
        
    }
    else{
        var bookingdetails=await bookings.find({docid:req.session.docid});
    }

    return res.render("myappointments",{
        username: req.session.name,
        mobileno: req.session.mobileno,
        email: req.session.email,
        gender: req.session.gender,
        dateofbirth: req.session.dateofbirth,
        bookingdate:req.session.bookingdate,
        doctorimg:req.session.docimg,
        isDoctor: req.session.isDoctor,
        image: req.session.image,
        slottime:req.session.slotbookingtime,
        docname:req.session.docnameforbook,
        qualification:req.session.qualification,
        hospital:req.session.hospital,
        scheduleid:req.session.scheduleid,
        bookingdetails:bookingdetails
      });
    }


//Deleting appointment

const deleteappointment=async(req,res)=>{
    var scheduleid=req.params.scheduleid;
    var slotid=req.params.slotid;
    try{
        var schedule=await schedules.findOne({_id:scheduleid});
        var slot=schedule.slots.id(slotid);
        slot.isBooked=false;
        await schedule.save();
        const findbooking=await bookings.findOneAndRemove({slotid:slotid});
        if(findbooking){
            console.log("deleted successfully booking");
            return res.redirect("/myappointments");
        }

    }
    catch(err){
        console.log("can't delete appointments",err);
        return res.redirect("/myappointments");
    }
}


//Reschedule appointment
const reschedule=async(req,res)=>{
    const prevscheduleid=req.params.scheduleid;
    const prevslotid=req.params.slotid;
    req.session.prevscheduleid=prevscheduleid;
    req.session.prevslotid=prevslotid;

    return res.redirect("/doctor");
}

module.exports={
    myappointment:myappointment,
    deleteappointment:deleteappointment,
    reschedule:reschedule
}

