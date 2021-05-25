var express= require('express');
var ejs=require('ejs');
const path= require('path');
var mongoose=require('mongoose');
var bodyParser = require('body-parser');
const mainroute=require("./backend/routes/mainroute");
var app=express();
const session=require("express-session");
const fetch=require("node-fetch");

const OtpManager = require("./OtpManager");
const otpRepository = require("./otpRepository");
const otpSender = require("./otpSender");
const user=require("./backend/database/schema");

require("./backend/database/conn");
require("./backend/database/schema");
const dotenv=require("dotenv");
dotenv.config({path:'./backend/config.env'});

const flash= require('connect-flash');
app.use(flash());




app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
var finalPath=path.join(__dirname,"/client/views");
//console.log(finalPath);
const staticpath=path.join(__dirname,"/client/public");
const staticimages=path.join(__dirname,"/images");
//console.log(staticpath);
app.use(express.static(staticpath));
app.use(express.static(staticimages));
app.engine("html", ejs.renderFile);
app.set("view engine","ejs");
app.set("views",finalPath);

app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:false,
    cookie:{
        path:'/',
        httpOnly:true,
        maxAge: null,
        secure:false,

    }
}));


const otpManager = new OtpManager(otpRepository, {
    otpLength: 4,
    validityTime: 4,
  });


  app.post("/otp/:token", async(req, res) => {

    const number = req.body.mobileno;
    var k= await user.findOne({mobileno: number });
  
    user.findOne({mobileno: number }).then((user) => {
      if (user) {
        const otp = otpManager.create(req.params.token);
        req.body.recieverNumber ="918119954633";
        console.log("Otp wala");
        console.log(req.body);
        req.session.user={number};
        req.session.name=k.name;
        otpSender.send(otp, req.body);
        console.log(`Your token code is ${otp.token} and otp is ${otp.code}`);
        res.redirect('/otpenter');
  
      }
      else {
  
        //req.flash("fail", "Failure");
        //req.flash("fail", "Invalid number");
        return res.redirect("/signup");
      }
  
    })
  
  });



  //Verify Otp

  app.post("/verifyotp/:token", (req, res) => {
    var code = req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4 ;
    console.log(code);
    
    const verificationResults = otpManager.VerificationResults;
    const verificationResult = otpManager.verify(
      req.params.token,
      code
    );
    let statusCode;
    let bodyMessage;
  
    switch (verificationResult) {
      case verificationResults.valid:

        req.flash("success", "Welcome");
                req.flash("success", "Login Successfull");
        
        return res.redirect("/index");
        break;
      case verificationResults.notValid:
        //req.flash("fail", "Failure");
        //req.flash("fail", "Invalid OTP");
        req.session.destroy(()=>{
          console.log("session destroyed");
        });
        return res.redirect("/otpnumber");
        break;
      case verificationResults.checked:
        //req.flash("fail", "Failure");
        //req.flash("fail", "code already used");
        req.session.destroy(()=>{
          console.log("session destroyed");
        });
        return res.redirect("/otpnumber");
        break;
      case verificationResults.expired:
        //req.flash("fail", "Failure");
        //req.flash("fail", "OTP expired");
        req.session.destroy(()=>{
          console.log("session destroyed");
        });
        return res.redirect("/otpnumber");
        break;
      default:
        //req.flash("fail", "Failure");
        //req.flash("fail", "cannot send");
        req.session.destroy(()=>{
          console.log("session destroyed");
        });
        return res.redirect("/otpnumber");
    }
    res.status(statusCode).send(bodyMessage);
  });

app.use("/",mainroute);

app.get("*",(req,res)=>{
  res.render("error");
})
var port=process.env.port || 4000;
app.listen(port,()=>{
    console.log("server is listening");
});