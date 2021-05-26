var express=require('express');
var session=require("express-session");
const User=require("../database/schema");
const mongoose=require("mongoose");

const redirectlogin=(req,res,next)=>{
    
    if(!req.session.user){
        req.flash("fail", "Failure");
        req.flash("fail", "Plz Login First");
        return res.redirect("/");
    }
    else{
        next();
    }
}

const adminauth=(req,res,next)=>{
    
    if(req.session.email!="admin@gmail.com" && req.session.password!="admin@123"){
        req.flash("fail", "Failure");
        req.flash("fail", "Plz Login First");
        if(req.session.email){
            console.log("accessing to admin thats why destroy");
            req.session.destroy();
        }
        return res.redirect("/");
    }
    else{
        next();
    }
}

module.exports={
    redirectlogin:redirectlogin,
    adminauth:adminauth
}