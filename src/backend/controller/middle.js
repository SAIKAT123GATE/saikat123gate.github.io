var express = require("express");
const User = require("../database/schema");
const mongoose = require("mongoose");
const docdetails = require("../database/docdetails");
const schedules = require("../database/appointment");
const medicalreport = require("../database/medicalreport");
const multer=require('multer');
const { findOneAndDelete } = require("../database/appointment");
const indexget = (req, res) => {
    req.session.prevslotid=false;
    req.session.prevscheduleid=false;
  return res.render("index", {
    msg: req.flash("success"),
    username: req.session.name,
    image: req.session.image,
    isadmin:req.session.isAdmin
  });
};
const doctorpageget = async (req, res) => {
  req.session.prevslotid=false;
  req.session.prevscheduleid=false;
  req.session.prevslotid=false;

  let { page, items_per_page } = req.query;
  if (!page) {
    page = 1;
  }
  if (!items_per_page) {
    items_per_page = 3;
  }

  const skip = (page - 1) * items_per_page;
  const count = await docdetails.find().countDocuments();
  const alldoc=await docdetails.find();
  //console.log("counting total docs");
  //console.log(count);
  var findall = await docdetails.find().sort(req.session.sortBy).limit(items_per_page).skip(skip);
  if(findall){
    if(req.session.query){
      findall = await docdetails.find(req.session.query).sort(req.session.sortBy).limit(items_per_page).skip(skip);
    }
  }
  req.session.findall = findall;

  //For getting day
  

  var finddoc=await docdetails.find();
  
  //console.log("printing day for checking schedule",comparearray);
 
  //console.log("printing docarr",docarr);

  console.log("Printing id for reschedule",req.session.prevslotid);
  return res.render("doctor", {
    username: req.session.name,
    findall: findall,
    image: req.session.image,
    totaldetails: count,
    hasnextpage: page * items_per_page < count,
    haspreviouspage: page > 1,
    nextpage: page + 1,
    previouspage: page - 1,
    lastpage: Math.ceil(count / items_per_page),
    isadmin:req.session.isAdmin,
    alldoc:alldoc,
    filter:req.session.filter?req.session.filter:"undefined"
    
    
  });
};

const hospitalpageget = (req, res) => {
    req.session.prevslotid=false;
    req.session.prevscheduleid=false;
  return res.render("hospital", {
    msg: req.flash("success"),
    username: req.session.name,
    image: req.session.image,
    isadmin:req.session.isAdmin
  });
};

const treatmentpageget = (req, res) => {
    req.session.prevslotid=false;
    req.session.prevscheduleid=false;
  return res.render("treatment", {
    msg: req.flash("success"),
    username: req.session.name,
    image: req.session.image,
    isadmin:req.session.isAdmin
  });
};
const aboutpageget = (req, res) => {
    req.session.prevslotid=false;
    req.session.prevscheduleid=false;
  return res.render(
    "aboutUs",

    {
      msg: req.flash("success"),
      username: req.session.name,
      image: req.session.image,
      isadmin:req.session.isAdmin
    }
  );
};

const otpnumberpageget = (req, res) => {
  return res.render("otpnumber");
};

const otpenterpageget = (req, res) => {
  return res.render("otpenter");
};

const tvastraplus = (req, res) => {
  return res.render("tvastraplus", {
    msg: req.flash("success"),
    username: req.session.name,
    image: req.session.image,
    isadmin:req.session.isAdmin
  });
};

const logout = (req, res) => {
  req.session.destroy(() => {
    console.log("session destroyed");
  });
  return res.redirect("/");
};

const profilepageget = (req, res) => {
    req.session.prevslotid=false;
    req.session.prevscheduleid=false;
  return res.render("profile", {
    username: req.session.name,
    mobileno: req.session.mobileno,
    email: req.session.email,
    gender: req.session.gender,
    dateofbirth: req.session.dateofbirth,
    city: req.session.city,
    state: req.session.state,
    country: req.session.country,
    description: req.session.description,
    hospitals: req.session.hospitals,
    achievements: req.session.achievements,
    exp: req.session.exp,
    qualification: req.session.qualification,
    awards: req.session.awards,
    specialization: req.session.specialization,
    fees: req.session.fees,
    isDoctor: req.session.isDoctor,
    image: req.session.image,
    isadmin:req.session.isAdmin
  });
};

const schedule = (req, res) => {

  return res.render("schedule", {
    username: req.session.name,
    mobileno: req.session.mobileno,
    email: req.session.email,
    gender: req.session.gender,
    dateofbirth: req.session.dateofbirth,
    city: req.session.city,
    state: req.session.state,
    country: req.session.country,
    description: req.session.description,
    hospitals: req.session.hospitals,
    achievements: req.session.achievements,
    exp: req.session.exp,
    qualification: req.session.qualification,
    awards: req.session.awards,
    specialization: req.session.specialization,
    fees: req.session.fees,
    isDoctor: req.session.isDoctor,
    image: req.session.image,
    day: schedules.days,
    hospital: schedules.hospital,
    fromtime: schedules.fromtime,
    totime: schedules.totime,
    isadmin:req.session.isAdmin
  });
};

const booking = (req, res) => {
  
  console.log("printing reshed from booking page",req.session.prevslotid);
  res.render("booking",{
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
    isadmin:req.session.isAdmin
  });
};

const settingspageget = async (req, res) => {
  return res.render("settings", {
    username: req.session.name,
    mobileno: req.session.mobileno,
    email: req.session.email,
    gender: req.session.gender,
    dateofbirth: req.session.dateofbirth,
    city: req.session.city,
    state: req.session.state,
    country: req.session.country,
    description: req.session.description,
    hospitals: req.session.hospitals,
    achievements: req.session.achievements,
    exp: req.session.exp,
    qualification: req.session.qualification,
    awards: req.session.awards,
    specialization: req.session.specialization,
    fees: req.session.fees,
    isDoctor: req.session.isDoctor,
    image: req.session.image,
    msg2: req.flash("success"),
    isadmin:req.session.isAdmin
  });
};

const changepassword = async (req, res) => {
  const currentpassword = req.body.currentpassword;
  const newpassword = req.body.newpassword;
  const confirmpassword = req.body.confirmpassword;
  try {
    if (newpassword != confirmpassword) {
      req.flash("success", "Password doesnot match");
      return res.redirect("/settings");
    }
    if (req.session.password == newpassword) {
      req.flash("success", "New Password can't be Same");
      return res.redirect("/settings");
    }

    if (currentpassword != req.session.password) {
      req.flash("success", "Invalid Current Password");
      console.log(req.session.password);
      console.log(req.body.currentpassword);
      return res.redirect("/settings");
    }
    var user = await User.findOneAndUpdate(
      { email: req.session.email },
      {
        password: newpassword,
      }
    );
    if (user) {
      console.log("password updated successfully");
      
      req.flash("success", "Updated Successfully");
      req.session.destroy(() => {
        console.log("session destroyed");
      });
      return res.redirect("/");
    }
  } catch (err) {
    console.log("error occurs in password updation");
    console.log(err);
    return res.redirect("/settings");
  }
};

//Medical report

const medicalreportget = async (req, res) => {
    var record=await medicalreport.find({email:req.session.email});
    var countrecord=record.length;
    //console.log("counting the record length",countrecord);
  return res.render("medicalreport", {
    username: req.session.name,
    mobileno: req.session.mobileno,
    email: req.session.email,
    gender: req.session.gender,
    dateofbirth: req.session.dateofbirth,
    city: req.session.city,
    state: req.session.state,
    country: req.session.country,
    
    fees: req.session.fees,
    isDoctor: req.session.isDoctor,
    image: req.session.image,
    countrecord:countrecord,
    record:record,
    isadmin:req.session.isAdmin
  });
};

const medicalreportpost = async (req, res) => {
    try{
    var dateofreport=req.body.dateofreport;
    const email = req.session.email;
  const name = req.session.name;
  const report=req.body.report;
  const title=req.body.title;
  const images=req.files;
  //console.log("printing files name in add mediacl record",images);
  var picarray = [];
  for (var i = 0; i < images.length; i++) {
    picarray.push(images[i].filename);
  }
  
  
    const reports = new medicalreport({
      email: email,
      name: name,
      date: dateofreport,
      report: report,
      title: title,
      image:picarray
    });
    const reportdata = await reports.save();
    if (reportdata) {
      console.log("report added successfully");
      return res.redirect("/medicalreport");
    }
  }
   catch (err) {
    console.log("can't added report");
    console.log(err);
  }
};

const deletemedicalrecords= async(req,res)=>{
    const id=req.params.id;
    try{
    var deletedata= await medicalreport.findOneAndDelete({_id:id});
    if(deletedata){
        console.log("deleted successfully");
        res.redirect("/medicalreport");
    }
    }
    catch(err){
        console.log("can not delete",err);
        res.redirect("/medicalreport");
    }
}

const docprofile=async(req,res)=>{
  return res.render("doctorprofile", {
    username: req.session.name,
    mobileno: req.session.mobileno,
    email: req.session.email,
    gender: req.session.gender,
    dateofbirth: req.session.dateofbirth,
    city: req.session.city,
    state: req.session.state,
    country: req.session.country,
    
    
    isDoctor: req.session.isDoctor,
    image: req.session.image,
    isadmin:req.session.isAdmin
  });
}


//show Records
const showrecords=async (req,res)=>{
  var id=req.params.id;
  //console.log(id);
  const userrecords=await medicalreport.findOne({_id:id});
  var images=userrecords.image;
  //console.log(images);
  return res.render("showrecords",{
    username: req.session.name,
    mobileno: req.session.mobileno,
    email: req.session.email,
    gender: req.session.gender,
    dateofbirth: req.session.dateofbirth,
    city: req.session.city,
    state: req.session.state,
    country: req.session.country,
    images:images,
    id:id,
    
    
    isDoctor: req.session.isDoctor,
    image: req.session.image,
    isadmin:req.session.isAdmin
  })
}

const addmedicalimage=async(req,res)=>{
  var id=req.params.id;
  var reportfind=await medicalreport.findOne({_id:id});
  const images=req.files;
  //console.log("images in add image in report",req.files);
  for(i=0;i<images.length;i++){
    reportfind.image.push(images[0].filename);
  }
  await reportfind.save();
  return res.redirect("/"+id+"/showrecords");
}


const deletemedicalimage=async(req,res)=>{
  var id=req.params.id;
  var index=req.params.index;
  var reportfind=await medicalreport.findOne({_id:id});
  reportfind.image.splice(index,1);
  await reportfind.save();
  return res.redirect("/"+id+"/showrecords");

}


//sort by
const sortby=async(req,res)=>{
  var sort=req.body.sort.split("-");
  console.log("checking sort",sort);
  if(sort[0]=="name"){
    if(sort[1]=="asc"){
      var query={"name":1};
    }
    else if (sort[1] == "desc") {
      var query = { "name": -1 };
  }
  }
  if(sort[0]=="fees"){
    if(sort[1]=="asc"){
      var query={"fees":1};
    }
    else if (sort[1] == "desc") {
      var query = { "name": -1 };
  }
  }


  if(sort[0]=="exp"){
    if(sort[1]=="asc"){
      var query={"exp":1};
    }
    else if (sort[1] == "desc") {
      var query = { "exp": -1 };
  }
  }
  req.session.sortBy = query;
    
  return res.redirect("/doctor");
  
}


//Add filter
const filterfunction=async(req,res)=>{
  const location=req.body.state;
  const treatments=req.body.treatments;
  const hospitals=req.body.hospitals;
  const state=req.body.states;
  const hospitalname=req.body.hospitalname;
  console.log("printing treatments",typeof(treatments));
  
    var filter = [];
    var locationlist = [];
    var treatmentlist = [];
    var hospitallist = [];
    if(state){
      filter.push(state);
          locationlist.push(state);
    }
    if(hospitalname){
      filter.push(hospitalname);
          hospitallist.push(hospitalname);
    }
    if (location) {
      if (typeof (location) == "string") {
          filter.push(location);
          locationlist.push(location);

      } else {
          for (var i = 0; i < location.length; i++) {
              filter.push(location[i]);
              locationlist.push(location[i]);
          }
      }
  }

  if(treatments){
    if (typeof(treatments)=="string") {
      filter.push(treatments);
      treatmentlist.push(treatments);

  }
  else{
    
    for (var i = 0; i < treatments.length; i++) {
      filter.push(treatments[i]);
      treatmentlist.push(treatments[i]);
  }
}
  }

  if(hospitals){
    if (typeof(hospitals)=="string") {
      filter.push(hospitals);
      hospitallist.push(hospitals);

  }
  else{
    
    for (var i = 0; i <hospitals.length ; i++) {
      filter.push(hospitals[i]);
      hospitallist.push(hospitals[i]);
  }
}
  }
  var query = {
    
    "state": { $all: locationlist },
    "specialization":{$all: treatmentlist},
    "hospitals":{$all: hospitallist}
  }
  
if (treatmentlist.length == 0) {
    delete query["specialization"];
}
if (locationlist.length == 0) {
    delete query["state"];
}
if (hospitallist.length == 0) {
  delete query["hospitals"];
}
  req.session.query = query;
  console.log("printing query",query);
    console.log("printing filter",filter);



    req.session.filter = filter;
    res.redirect("/doctor");

}

module.exports = {
  indexget: indexget,
  doctorpageget: doctorpageget,
  hospitalpageget: hospitalpageget,
  treatmentpageget: treatmentpageget,
  aboutpageget: aboutpageget,
  otpnumberpageget: otpnumberpageget,
  otpenterpageget: otpenterpageget,
  tvastraplus: tvastraplus,
  logout: logout,
  profilepageget: profilepageget,
  bookingpageget: booking,
  schedule: schedule,
  settingspageget: settingspageget,
  changepassword: changepassword,
  medicalreportget: medicalreportget,
  medicalreportpost:medicalreportpost,
  deletemedicalrecords:deletemedicalrecords,
  docprofile:docprofile,
  showrecords:showrecords,
  addmedicalimage:addmedicalimage,
  deletemedicalimage:deletemedicalimage,
  sortby:sortby,
  filterfunction:filterfunction
};
