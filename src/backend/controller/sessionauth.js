var express=require('express');
var session=require("express-session");
const User=require("../../database/schema");
const mongoose=require("mongoose");

const redirectlogin=(req,res,next)=>{
    if(!req.session.user){
        return res.redirect("/");
    }
    else{
        next();
    }
}

module.exports={
    redirectlogin:redirectlogin
}