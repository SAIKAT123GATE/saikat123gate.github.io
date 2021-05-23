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
        //console.log("booking details of user",bookingdetails);
        var upcomingdetails=[];
        var completeddetails=[];
        for(var k=0;k<bookingdetails.length;k++){
        var checkdate=bookingdetails[k].checkdate.split(" ");
        //console.log("checing checkdate",(checkdate));
        var date=new Date();
        var month=parseInt(date.getMonth());
        var day=parseInt(date.getDate());
        var year=parseInt(date.getFullYear());
        if(day>parseInt(checkdate[1]) && month>=parseInt(checkdate[0]) && year>=parseInt(checkdate[2])){
            completeddetails.push(bookingdetails[k]);
            var scheduleid=bookingdetails[k].scheduleid;
            var slotid=bookingdetails[k].slotid;
            var schedule=await schedules.findOne({_id:scheduleid});
            var slot=schedule.slots.id(slotid);
            slot.isBooked=false;
            await schedule.save();
        }
        else{
            upcomingdetails.push(bookingdetails[k]);
        }
        }

        //console.log("completed details",completeddetails);
        //console.log("upcoming details",upcomingdetails);
        
    }
    else{
        var bookingdetails=await bookings.find({docid:req.session.docid});
        var upcomingdetails=[];
        var completeddetails=[];
        for(var k=0;k<bookingdetails.length;k++){
        var checkdate=bookingdetails[k].checkdate.split(" ");
        //console.log("checing checkdate",(checkdate));
        var date=new Date();
        var month=parseInt(date.getMonth());
        var day=parseInt(date.getDate());
        var year=parseInt(date.getFullYear());
        if(day>parseInt(checkdate[1]) && month>=parseInt(checkdate[0]) && year>=parseInt(checkdate[2])){
            completeddetails.push(bookingdetails[k]);
            var scheduleid=bookingdetails[k].scheduleid;
            var slotid=bookingdetails[k].slotid;
            var schedule=await schedules.findOne({_id:scheduleid});
            var slot=schedule.slots.id(slotid);
            slot.isBooked=false;
            await schedule.save();
        }
        else{
            upcomingdetails.push(bookingdetails[k]);
        }
        }

        //console.log("completed details",completeddetails);
        //console.log("upcoming details",upcomingdetails);
        
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
        bookingdetails:bookingdetails,
        completeddetails:completeddetails,
        upcomingdetails:upcomingdetails,
        isadmin:req.session.isAdmin
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
    const prevdocid=req.params.docid;
    req.session.prevscheduleid=prevscheduleid;
    req.session.prevslotid=prevslotid;
    req.session.prevdocid=prevdocid;


    return res.redirect("/reschedule");
}

module.exports={
    myappointment:myappointment,
    deleteappointment:deleteappointment,
    reschedule:reschedule
}

