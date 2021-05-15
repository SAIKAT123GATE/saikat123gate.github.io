const express = require("express");
const User = require("../database/schema");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookie = require("cookies");
const { request } = require("express");
const docdetails = require("../database/docdetails");
const path=require("path");

const loginuser = (req, res) => {
  return res.render("login", {
    msg1: req.flash("fail"),
  });
};

const loginauth = async (req, res) => {
  const { email, password } = req.body;
  try {
    var exist = await User.findOne({ email: email });
    if (exist) {
      var checkpass = await User.findOne({ email: email, password: password });
      var findall= await docdetails.find();
      console.log("finding length of doctor database");
      console.log(findall.length);
      if (checkpass) {
        console.log("authentication successful");
        
        //creating sessions
        req.session.user = { email, password };
        req.session.password=checkpass.password;
        req.session.name = checkpass.name;
        req.session.email = checkpass.email;
        req.session.mobileno = checkpass.mobileno;
        req.session.gender = checkpass.gender;
        req.session.dateofbirth = checkpass.dateofbirth;
        req.session.state = checkpass.state;
        req.session.isDoctor = checkpass.isDoctor;
        req.session.country = checkpass.country;
        req.session.city=checkpass.city;
        req.session.findall=findall;
        req.session.id=checkpass._id;
        
         
          var doctor = await docdetails.findOne({ email:email });
          

            if(doctor){
            req.session.description = doctor.description;
            req.session.hospitals = doctor.hospitals;
            req.session.achievements = doctor.achievements;
            req.session.exp = doctor.exp;
            req.session.qualification = doctor.qualification;
            req.session.awards = doctor.awards;
            req.session.specialization = doctor.specialization;
            req.session.fees = doctor.fees;
            req.session.image=doctor.image
            
            }
        
        //const token = await exist.generateAuthToken();
       // res.cookie("jwtoken", token, {
        //  expires: new Date(Date.now() + 25892000000),
       // });

        //console.log(req.session.password);
        req.flash("success", "Welcome");
        req.flash("success", "Login Successfull");
        return res.redirect("/index");
      } else {
        req.flash("fail", "Failure");
        req.flash("fail", "Invalid email or password");

        return res.redirect("/");
      }
    } else {
      console.log("signup first");
      req.flash("fail", "Failure");
      req.flash("fail", "Invalid email or password");

      return res.redirect("/");
    }
  } catch (err) {
    console.log(err);

    return res.redirect("/");
  }
};

module.exports = {
  loginuser: loginuser,
  loginauth: loginauth,
};
