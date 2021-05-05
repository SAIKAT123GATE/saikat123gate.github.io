var express = require("express");
var fs=require("fs");
const path=require('path');
const docdetails = require("../database/docdetails");
const User = require("../database/schema");
var mongoose = require("mongoose");
const mainroutes=require("../routes/mainroute");
const multer=require('multer');
const docdetailsget = (req, res) => {
  if (req.session.user) return res.render("doctordetails");
  else {
    return res.redirect("/signup");
  }
};




const docdetailsregister = async (req, res) => {
  const {
    description,
    hospitals,
    achievements,
    exp,
    qualification,
    awards,
    specialization,
    fees,
  } = req.body;
  
 
  const email = req.session.email;
  try {
    const user = new docdetails({
      name:req.session.name,
      email:req.session.email,
      description,
      hospitals,
      achievements,
      exp,
      qualification,
      awards,
      specialization,
      fees,
      city:req.session.city,
      image:req.file.filename
    });
    const register = await user.save();
    if (register) {
      req.session.description = description;
      req.session.hospitals = hospitals;
      req.session.achievements = achievements;
      req.session.exp = exp;
      req.session.qualification = qualification;
      req.session.awards = awards;
      req.session.specialization = specialization;
      req.session.fees = fees;
      req.session.image=req.file.filename;
      
      
      console.log("saved successfully");
      req.flash("success", "Welcome");
      req.flash("success", "Signup Successfull");
      return res.redirect("/index");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("/docdetails");
  }
};

const updateprofile = async (req, res) => {
    const user = await User.findOne({ email: req.session.email });
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
      isDoctor: req.session.isDoctor,
    }
  );

  if(req.session.isDoctor){
  const doc = await docdetails.findOne({ email: req.session.email });
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
      image:req.file.filename
    }
  );
  if (updated && updated2) {
    req.session.name = name;
    req.session.email = email;
    req.session.mobileno = mobileno;
    req.session.gender = gender;
    req.session.dateofbirth = dateofbirth;
    req.session.state = state;
    req.session.isDoctor = updated.isDoctor;
    req.session.country = country;
    req.session.city = city;
    req.session.description = description;
    req.session.hospitals = hospitals;
    req.session.achievements = achievements;
    req.session.exp = exp;
    req.session.qualification = qualification;
    req.session.awards = awards;
    req.session.specialization = specialization;
    req.session.fees = fees;
    req.session.image=req.file.filename;
    console.log("updation successfull");
    return res.redirect("/profile");
  } else {
    console.log("updation failed");
    return res.redirect("/profile");
  }
}
else{
    if(updated){
        req.session.name = name;
    req.session.email = email;
    req.session.mobileno = mobileno;
    req.session.gender = gender;
    req.session.dateofbirth = dateofbirth;
    req.session.state = state;
    req.session.isDoctor = updated.isDoctor;
    req.session.country = country;
    req.session.city = city;
    return res.redirect("/profile");
    }
    else {
        return res.redirect("/profile");
      }
}
}

module.exports = {
  docdetailsget: docdetailsget,
  docdetailsregister: docdetailsregister,
  updateprofile: updateprofile

};
