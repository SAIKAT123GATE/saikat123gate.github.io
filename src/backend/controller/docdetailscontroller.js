var express = require("express");
var fs = require("fs");
const path = require("path");
const docdetails = require("../database/docdetails");
const hospitaldetail = require("../database/hospital");
const User = require("../database/schema");
var mongoose = require("mongoose");
const mainroutes = require("../routes/mainroute");
const multer = require("multer");
const hospitaldetails = require("../database/hospital");
const medicalreport = require("../database/medicalreport");
const bookings = require("../database/booking");
const docdetailsget = (req, res) => {
  return res.render("doctordetails");
};

const docdetailsregister = async (req, res) => {
  const description = req.body.description;
  const hospitals = JSON.parse(req.body.hospitals)
    .map(function (item) {
      return item["value"];
    })
    .toString();

  //consoling something
  var s = hospitals.split(",");
  var hospitalsarray = [];
  console.log("printing hospitals", s);
  for (var z = 0; z < s.length; z++) {
    hospitalsarray.push(s[z]);
  }
  const achievements = JSON.parse(req.body.achievements)
    .map(function (item) {
      return item["value"];
    })
    .toString();
  const exp = req.body.exp;
  const qualification = JSON.parse(req.body.qualification)
    .map(function (item) {
      return item["value"];
    })
    .toString();
  const awards = JSON.parse(req.body.awards)
    .map(function (item) {
      return item["value"];
    })
    .toString();
  const specialization = JSON.parse(req.body.specialization)
    .map(function (item) {
      return item["value"];
    })
    .toString();

  var l = specialization.split(",");
  var specializationarray = [];
  console.log("printing specialization", l);
  for (var z = 0; z < l.length; z++) {
    specializationarray.push(l[z]);
  }
  const fees = req.body.fees;

  const email = req.session.email;
  const password = req.session.password;
  try {
    const user = new docdetails({
      name: req.session.name,
      email: req.session.email,
      description,
      hospitals,
      achievements,
      exp,
      qualification,
      awards,
      specialization,
      specializationarray,
      fees,
      city: req.session.city,
      image: req.file.filename,
      gender: req.session.gender,
      dateofbirth: req.session.dateofbirth,
      mobileno: req.session.mobileno,
      state: req.session.state,
      city: req.session.city,
      country: req.session.country,
      hospitalsarray,
    });
    const register = await user.save();
    for(var k=0;k<hospitalsarray.length;k++){
    var hospitalexists = await hospitaldetail.findOne({ name: hospitalsarray[k] });
    console.log("hospital alreay exists");
    if (!hospitalexists) {
      var hospitalregister = new hospitaldetail({
        name: hospitalsarray[k],
        description: "No Info Available",
        speciality: specialization,
        image:
          "https://image.shutterstock.com/image-vector/medical-concept-hospital-building-doctor-600w-588196298.jpg",
        location: "No info Available",
        beds: 20,
        treatments: specialization,
      });
      var hospitalsave = await hospitalregister.save();
    }
  }

    if (register) {
      req.session.user = { email, password };
      req.session.description = description;
      req.session.hospitals = hospitals;
      req.session.achievements = achievements;
      req.session.exp = exp;
      req.session.qualification = qualification;
      req.session.awards = awards;
      req.session.specialization = specialization;
      req.session.fees = fees;
      req.session.image = req.file.filename;

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
  const { name, email, gender, dateofbirth, mobileno, state, city, country } =
    req.body;
  if (req.session.isDoctor) {
    const description = req.body.description;
    const hospitals = JSON.parse(req.body.hospitals)
      .map(function (item) {
        return item["value"];
      })
      .toString();

    //consoling something
    var s = hospitals.split(",");
    var hospitalsarray = [];
    console.log("printing hospitals", s);
    for (var z = 0; z < s.length; z++) {
      hospitalsarray.push(s[z]);
    }
    const achievements = JSON.parse(req.body.achievements)
      .map(function (item) {
        return item["value"];
      })
      .toString();
    const exp = req.body.exp;
    const qualification = JSON.parse(req.body.qualification)
      .map(function (item) {
        return item["value"];
      })
      .toString();
    const awards = JSON.parse(req.body.awards)
      .map(function (item) {
        return item["value"];
      })
      .toString();
    const specialization = JSON.parse(req.body.specialization)
      .map(function (item) {
        return item["value"];
      })
      .toString();

    var l = specialization.split(",");
    var specializationarray = [];
    console.log("printing specialization", l);
    for (var z = 0; z < l.length; z++) {
      specializationarray.push(l[z]);
    }
    const fees = req.body.fees;
  }

  var reportfind = await medicalreport.find({ email: req.session.email });
  if (reportfind) {
    for (var k = 0; k < reportfind.length; k++) {
      reportfind[k].name = name;
      await reportfind[k].save();
    }
  }

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
      image: req.file ? req.file.filename : req.session.image,
    }
  );
  if (!req.session.isDoctor) {
    var bookingfind = await bookings.find({ username: req.session.name });
    
    if (bookingfind) {
      for (var k = 0; k < bookingfind.length; k++) {
        bookingfind[k].username = name;
        await bookingfind[k].save();
      }
    }
  }

  

  if (req.session.isDoctor) {
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
        name: name,
        email: email,
        gender: gender,
        dateofbirth: dateofbirth,
        mobileno: mobileno,
        state: state,
        city: city,
        country: country,
        hospitalsarray: hospitalsarray,
        specializationarray: specializationarray,

        image: req.file ? req.file.filename : req.session.image,
      }
    );

    var bookingfind = await bookings.find({ docname: req.session.name });
    
    if (bookingfind) {
      for (var k = 0; k < bookingfind.length; k++) {
        bookingfind[k].username = name;
        await bookingfind[k].save();
      }
    }


   

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
      req.session.image = req.file ? req.file.filename : req.session.image;
      console.log("updation successfull");
      return res.redirect("/profile");
    } else {
      console.log("updation failed");
      return res.redirect("/profile");
    }
  } else {
    if (updated) {
      req.session.name = name;
      req.session.email = email;
      req.session.mobileno = mobileno;
      req.session.gender = gender;
      req.session.dateofbirth = dateofbirth;
      req.session.state = state;
      req.session.isDoctor = updated.isDoctor;
      req.session.country = country;
      req.session.city = city;
      req.session.image = req.file ? req.file.filename : req.session.image;

      return res.redirect("/profile");
    } else {
      return res.redirect("/profile");
    }
  }
};

module.exports = {
  docdetailsget: docdetailsget,
  docdetailsregister: docdetailsregister,
  updateprofile: updateprofile,
};
