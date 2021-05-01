var express=require("express");
const User=require("../../database/schema");
var mongoose=require("mongoose");
const signupuser=(req,res)=>{
   return res.render("signup");
}


const signupregister= async (req,res)=>{
    const {name,email,password,gender,dateofbirth,mobileno,state,city,country}=req.body;
   /*if(!name || !email || !password || !gender || !dateofbirth || !mobileno || !state || !city || !country){
        console.log("Not field properly");
        return res.redirect("/signup");
    }*/
    try{
        const exists=await User.findOne({email:email});
        if(exists){
            console.log("email already exists");
            return res.redirect("/signup")
        }
        const user=new User({name,email,password,gender,dateofbirth,mobileno,state,city,country});
        const register= await user.save();
        if(register){
            console.log("saved successfully");
            return res.redirect("/");
        }
       
    }
    catch(err){
        console.log(err);
        return res.redirect("/signup");
    }
}

module.exports={
    signupuser:signupuser,
    signupregister:signupregister
}