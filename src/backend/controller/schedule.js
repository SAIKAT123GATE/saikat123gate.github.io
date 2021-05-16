var express = require("express");
var fs = require("fs");
const path = require("path");
const docdetails = require("../database/docdetails");
const User = require("../database/schema");
const schedules = require("../database/appointment");
var mongoose = require("mongoose");
const mainroutes = require("../routes/mainroute");
const multer = require("multer");


const getschedule= async (req,res)=>{

    var exists= await schedules.find({email:req.session.email});
    var countshed=await schedules.findOne({email:req.session.email}).countDocuments();
    //console.log("counting schedules for doc");
    //console.log(countshed);
    //console.log("schedule of doctor");
   // console.log(exists[0].days);

   //console.log(exists[0].slots.length);

    return res.render("schedule"
    ,
    {
        
        username:req.session.name,
        mobileno:req.session.mobileno,
        email:req.session.email,
        gender:req.session.gender,
        dateofbirth:req.session.dateofbirth,
        city:req.session.city,
        state:req.session.state,
        country:req.session.country,
        description:req.session.description ,
        hospitals:req.session.hospitals ,
        achievements:req.session.achievements,
        exp:req.session.exp ,
        qualification:req.session.qualification,
        awards:    req.session.awards ,
        specialization:    req.session.specialization,
        fees:req.session.fees,
        isDoctor:req.session.isDoctor,
        image:req.session.image,
        countshed:countshed,
        exists:exists

        

    });
}


const addschedule = async (req, res) => {
  var doctor=await docdetails.findOne({email:req.session.email});
  const email = req.session.email;
  const days = req.body.days;
  const createdby = doctor._id;
  const fromtime = req.body.fromtime;
  const totime = req.body.totime;
  const interval = req.body.interval;
  var intervaltime = parseInt(interval);
  const hospital = req.body.hospital;
  const date = new Date();
  var st = fromtime;
  var et = totime;

  var ar = et.split(":");

  var endhr = parseInt(ar[0]);
  var endmin = parseInt(ar[1]);
  var slotsarr = [{ time: st, days: req.body.days }];
  while (st != et) {
    var a = st.split(":");
    var sthr = parseInt(a[0]);
    var stmin = parseInt(a[1]);
    if (sthr >= endhr && stmin >= endmin) {
      break;
    }

    intervaltime = parseInt(interval);
    if (stmin + intervaltime >= 60) {
      stmin = stmin + intervaltime - 60;
      intervaltime = 00;
      sthr = sthr + 1;
      if (sthr >= 24) {
        sthr = 1;
      }
    }
    var result = sthr + ":" + (stmin + intervaltime);
    
    slotsarr.push({ time: result, days: days });
    st = result.toString();
    //console.log(st);
  }

  try {
    const appoint = await schedules.findOne({
      email: email,days:days,fromtime:fromtime
    });
    console.log("checking slot already created or not");
    console.log(appoint);

    if (appoint) {
      console.log("can not create schedule");
      return res.redirect("/addschedule");
    } else {
      const sched = new schedules({
        email: email,
        days: days,
        hospital: hospital,
        fromtime: fromtime,
        totime: totime,
        interval: interval,
        createdby: createdby,
        date: date,
        slots: slotsarr,
      });
      const slots = await sched.save();
      if (slots) {
        console.log("created successfull");
        return res.redirect("/addschedule");
      }
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/addschedule");
  }
};

module.exports = {
  addschedule: addschedule,
  getschedule:getschedule
};
