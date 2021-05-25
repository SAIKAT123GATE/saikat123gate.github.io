var express = require("express");
const User = require("../database/schema");
const mongoose = require("mongoose");
const docdetails = require("../database/docdetails");
const schedules = require("../database/appointment");
const medicalreport = require("../database/medicalreport");
const hospitals = require("../database/hospital");
const bookings = require("../database/booking");
const multer = require("multer");
const { json } = require("express");
const { findOne } = require("../database/schema");

const admindashboard = async (req, res) => {
  const users = await User.find({ isDoctor: false });
  const doctors = await docdetails.find();
  const appointment = await bookings.find();
  //console.log("printing only users from admin pannel",users);

  //Pagination

  let { page, items_per_page } = req.query;
  if (!page) {
    page = 1;
  }
  if (!items_per_page) {
    items_per_page = 4;
  }

  const skip = (page - 1) * items_per_page;
  const count = await User.find().countDocuments();

  //console.log("counting total docs");
  //console.log(count);
  var findall = await User.find().limit(items_per_page).skip(skip);
  return res.render("admindashboard", {
    users: users,
    doctors: doctors,
    appointment: appointment,
    findall: findall,
    lastpage: Math.ceil(count / items_per_page),
  });
};

const adminusers = async (req, res) => {
  const users = await User.find({ isDoctor: false });
  return res.render("adminusers", {
    users: users,
  });
};

const admindoctors = async (req, res) => {
  const doctors = await docdetails.find();
  return res.render("admindoctors", {
    doctors: doctors,
  });
};

const adminhospitals = async (req, res) => {
  const hospitaldet = await hospitals.find();
  return res.render("adminhospitals", {
    hospitaldet: hospitaldet,
  });
};

const adminappointment = async (req, res) => {
  var id5 = req.params.id;

  var person = await User.findOne({ _id: id5 });
  if (!person) {
    var doc = await docdetails.findOne({ _id: id5 });
    var person = await User.findOne({ email: doc.email });
  }
  var isDoctor = person.isDoctor;
  //console.log("booking details of user",bookingdetails);
  if (!isDoctor) {
    var bookingdetails = await bookings.find({ userid: id5 });
    var upcomingdetails = [];
    var completeddetails = [];
    for (var k = 0; k < bookingdetails.length; k++) {
      var checkdate = bookingdetails[k].checkdate.split(" ");
      //console.log("checing checkdate",(checkdate));
      var date = new Date();
      var month = parseInt(date.getMonth());
      var day = parseInt(date.getDate());
      var year = parseInt(date.getFullYear());
      if (
        day > parseInt(checkdate[1]) &&
        month >= parseInt(checkdate[0]) &&
        year >= parseInt(checkdate[2])
      ) {
        completeddetails.push(bookingdetails[k]);
        var scheduleid = bookingdetails[k].scheduleid;
        var slotid = bookingdetails[k].slotid;
        var schedule = await schedules.findOne({ _id: scheduleid });
        var slot = schedule.slots.id(slotid);
        slot.isBooked = false;
        await schedule.save();
      } else {
        upcomingdetails.push(bookingdetails[k]);
      }
    }
  } else {
    var bookingdetails = await bookings.find({ docid: id5 });
    var upcomingdetails = [];
    var completeddetails = [];
    for (var k = 0; k < bookingdetails.length; k++) {
      var checkdate = bookingdetails[k].checkdate.split(" ");
      //console.log("checing checkdate",(checkdate));
      var date = new Date();
      var month = parseInt(date.getMonth());
      var day = parseInt(date.getDate());
      var year = parseInt(date.getFullYear());
      if (
        day > parseInt(checkdate[1]) &&
        month >= parseInt(checkdate[0]) &&
        year >= parseInt(checkdate[2])
      ) {
        completeddetails.push(bookingdetails[k]);
        var scheduleid = bookingdetails[k].scheduleid;
        var slotid = bookingdetails[k].slotid;
        var schedule = await schedules.findOne({ _id: scheduleid });
        var slot = schedule.slots.id(slotid);
        slot.isBooked = false;
        await schedule.save();
      } else {
        upcomingdetails.push(bookingdetails[k]);
      }
    }

    //console.log("completed details",completeddetails);
    //console.log("upcoming details",upcomingdetails);
  }

  return res.render("adminappointments", {
    username: req.session.name,
    mobileno: req.session.mobileno,
    email: req.session.email,
    gender: req.session.gender,
    dateofbirth: req.session.dateofbirth,
    bookingdate: req.session.bookingdate,
    doctorimg: req.session.docimg,
    isDoctor: isDoctor,
    image: req.session.image,
    slottime: req.session.slotbookingtime,
    bookingdetails: bookingdetails,
    completeddetails: completeddetails,
    upcomingdetails: upcomingdetails,
    isadmin:req.session.isAdmin
  });
};

const editprofile = async (req, res) => {
    var emails=req.params.email;
    console.log("on post request checking email",emails);
  const user = await User.findOne({ email:emails });
  const {
    name,
    email,
    gender,
    dateofbirth,
    mobileno,
    state,
    city,
    country,
    description,
    hospitals,
    achievements,
    exp,
    qualification,
    awards,
    specialization,
    fees,
  } = req.body;

  const id1 = user._id;
  var updated = await User.findByIdAndUpdate(
    { _id: id1 },
    {
      name: name,
      email: email,
      gender: gender,
      dateofbirth: dateofbirth,
      mobileno: mobileno,
      state: state,
      city: city,
      country: country,
      image: req.file ? req.file.filename : user.image,
    }
  );

  if (user.isDoctor) {
    const doc = await docdetails.findOne({ email:email });
    const id2 = doc._id;

    var updated2 = await docdetails.findByIdAndUpdate(
      { _id: id2 },
      {
        description: description,
        email: email,
        hospitals: hospitals,
        achievements: achievements,
        exp: exp,
        qualification: qualification,
        awards: awards,
        specialization: specialization,
        fees: fees,
        name: name,
        email: email,
        gender: gender,
        dateofbirth: dateofbirth,
        mobileno: mobileno,
        state: state,
        city: city,
        country: country,

        image: req.file ? req.file.filename : doc.image,
      }
    );

    if (updated && updated2) {
      
      console.log("updation successfull");
      return res.redirect("/"+email);
    } else {
      console.log("updation failed");
      return res.redirect("/"+email);
    }
  } else {
    if (updated) {
      
      return res.redirect("/"+email);
    } else {
      return res.redirect("/"+email);
    }
  }
};



const editpageget = async (req, res) => {
    var email=req.params.email;
    console.log("printing email",email);
    
    var userone=await User.findOne({email:email});
    
    
  if (userone.isDoctor) {
    var doc = await docdetails.findOne({email:email});
    
    return res.render("admineditprofile", {
        username: doc.name,
        mobileno: doc.mobileno,
        email: doc.email,
        gender: doc.gender,
        dateofbirth: doc.dateofbirth,
        city: doc.city,
        state: doc.state,
        country: doc.country,
        description: doc.description,
        hospitals: doc.hospitals,
        achievements: doc.achievements,
        exp: doc.exp,
        qualification: doc.qualification,
        awards: doc.awards,
        specialization: doc.specialization,
        fees: doc.fees,
        isDoctor: userone.isDoctor,
        image: doc.image,
        isadmin:req.session.isAdmin
        
      });
  }
  return res.render("admineditprofile", {
    username: userone.name,
    mobileno: userone.mobileno,
    email: userone.email,
    gender: userone.gender,
    dateofbirth: userone.dateofbirth,
    city: userone.city,
    state: userone.state,
    country: userone.country,
    isDoctor: userone.isDoctor,
    image: userone.image,
    
  });
};



//medicalrecord get

const medicalrecordget=async(req,res)=>{

    var email=req.params.email;
    var record=await medicalreport.find({email:email});
    var countrecord=record.length;
    //console.log("counting the record length",countrecord);
  return res.render("adminmedicalreport", {
    
    
    
    countrecord:countrecord,
    record:record,
    isadmin:req.session.isAdmin
  });

}

//admin whole delete medical report

const admindeletemedicalreport=async(req,res)=>{
  const id=req.params.id;
  const email=req.params.email;
    try{
    var deletedata= await medicalreport.findOneAndDelete({_id:id});
    if(deletedata){
        console.log("deleted successfully");
        res.redirect("/medicalrecord/"+email);
    }
    }
    catch(err){
        console.log("can not delete",err);
        res.redirect("/medicalrecord/"+email);
    }
}

const editadminhospital=async(req,res)=>{
  var id=req.params.id;
  //console.log("printing hospital id",id);
  var hospitalfind=await hospitals.findOne({_id:id});
  //console.log("printing hospitalfind",hospitalfind);
  var hospitalname=JSON.parse(hospitalfind.name)[0].value;
  
  return res.render("edithospitaldetails",{
    hospitalfind:hospitalfind,
    hospitalname:hospitalname
  });
}


//Save Hospital
const saveedithospital=async(req,res)=>{
  var id=req.params.id;
  var hospitalfind=await hospitals.findOne({_id:id});
  const {
    description,
    hospitalname,
    achievements,
    qualification,
    specialization,
    fees,
  } = req.body;

  
  
  
  var updated=await hospitals.findByIdAndUpdate({_id:id},{
    name:hospitalname,
    description:description,
    treatment:achievements,
    beds:fees,
    specialization:specialization,
    image:req.file?req.file.filename:hospitalfind.image
  });
  if(updated){
    return res.redirect("/adminhospitals");
  }

}



//Get  a quote form
const getquote=async(req,res)=>{
  return res.render("queryform");
}

//Get about hospital

const abouthospital=async(req,res)=>{
  return res.render("about-hospital",{
    username: req.session.name,
    image: req.session.image,
    isadmin:req.session.isAdmin
  });
}

module.exports = {
  admindashboard: admindashboard,
  adminusers: adminusers,
  admindoctors: admindoctors,
  adminhospitals: adminhospitals,
  adminappointment: adminappointment,
  editprofile: editprofile,
  editpageget:editpageget,
  medicalrecordget:medicalrecordget,
  admindeletemedicalreport:admindeletemedicalreport,
  editadminhospital:editadminhospital,
  saveedithospital:saveedithospital,
  getquote:getquote,
  abouthospital:abouthospital
};
