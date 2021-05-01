const express=require('express');
const User=require("../../database/schema");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const cookie=require("cookies");


const loginuser=(req,res)=>{
    return res.render("login");
}

const loginauth= async(req,res)=>{
    const {email,password}=req.body;
    try{
        var exist= await User.findOne({email:email});
        if(exist){
            var checkpass= await User.findOne({email:email ,password:password});
            if(checkpass){
                console.log("authentication successful");
                //creating sessions
                req.session.user={email,password};
                
                const token= await exist.generateAuthToken();
                res.cookie("jwtoken",token,{
                    expires: new Date(Date.now()+25892000000),
                });
                return res.redirect("/index");
                
            }
            else{
                return res.redirect("/");
            }
            
        }
        else{
            console.log("signup first");
            
            return res.redirect("/signup");
        }
    }
    catch(err){
        console.log(err);
        
        return res.redirect("/");
    }

}

module.exports={
    loginuser:loginuser,
    loginauth:loginauth
}