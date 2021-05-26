var express=require("express");
const User=require("../database/schema");
var mongoose=require("mongoose");
const signupuser=(req,res)=>{
   return res.render("signup");
}


const signupregister= async (req,res)=>{
    const {name,email,password,gender,dateofbirth,mobileno,state,city,country}=req.body;
    req.body.isDoctor=Boolean(req.body.isDoctor);
    const isDoctor=req.body.isDoctor;
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
        const user=new User({name,email,password,gender,dateofbirth,mobileno,state,city,country,isDoctor:isDoctor,
            image:"https://image.shutterstock.com/image-vector/user-avatar-icon-button-profile-260nw-1517550290.jpg"
        });
        const register= await user.save();
        if(register){
            console.log("user saved successfully");
            req.session.user={email,password};
            req.session.name=name;
            req.session.isDoctor=isDoctor;
            req.session.email=email;
            req.session.gender=gender;
            req.session.dateofbirth=dateofbirth;
            req.session.mobileno=mobileno;
            req.session.state=state;
            req.session.city=city;
            req.session.country=country;
            req.session.isAdmin=false;
            req.session.image="https://image.shutterstock.com/image-vector/user-avatar-icon-button-profile-260nw-1517550290.jpg";
            if(isDoctor){
                return res.redirect("/docdetails");
            }
            req.flash("success", "Welcome");
                req.flash("success", "Signup Successfull");
            return res.redirect("/index");
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