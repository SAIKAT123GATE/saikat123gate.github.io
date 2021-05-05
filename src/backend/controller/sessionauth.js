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

module.exports={
    redirectlogin:redirectlogin
}