var express=require('express');
const User=require("../database/schema");
const mongoose=require("mongoose");
const docdetails=require("../database/docdetails");
const indexget=(req,res)=>{
    return res.render("index",{
        msg:req.flash("success"),
        username:req.session.name,
        image:req.session.image
    })
}
const doctorpageget=(req,res)=>{
    return res.render("doctor"
    ,
    {
        
        username:req.session.name,
        findall:req.session.findall,
        image:req.session.image
    });
}

const hospitalpageget=(req,res)=>{
    return res.render("hospital",
    {
        msg:req.flash("success"),
        username:req.session.name,
        image:req.session.image
    });
}

const treatmentpageget=(req,res)=>{
    return res.render("treatment",
    {
        msg:req.flash("success"),
        username:req.session.name,
        image:req.session.image
    });
}
const aboutpageget=(req,res)=>{
    return res.render("aboutUs",
    
    {
        msg:req.flash("success"),
        username:req.session.name,
        image:req.session.image
    });
}

const otpnumberpageget=(req,res)=>{
    return res.render("otpnumber");
}

const otpenterpageget=(req,res)=>{
    return res.render("otpenter");
}

const tvastraplus=(req,res)=>{
    return res.render("tvastraplus",{
        msg:req.flash("success"),
        username:req.session.name,
        image:req.session.image
    });
}

const logout=(req,res)=>{
    req.session.destroy(()=>{
        console.log("session destroyed");
    });
    return res.redirect("/");
}

const profilepageget=(req,res)=>{
    return res.render("profile"
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
        image:req.session.image

    });
}


module.exports={
    indexget:indexget,
    doctorpageget:doctorpageget,
    hospitalpageget:hospitalpageget,
    treatmentpageget:treatmentpageget,
    aboutpageget:aboutpageget,
    otpnumberpageget:otpnumberpageget,
    otpenterpageget:otpenterpageget,
    tvastraplus:tvastraplus,
    logout:logout,
    profilepageget:profilepageget

}