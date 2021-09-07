var express = require("express");
var ejs = require("ejs");
const path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
const mainroute = require("./backend/routes/mainroute");
var app = express();
const session = require("express-session");
const fetch = require("node-fetch");
const User = require("./backend/database/schema");
const docdetails = require("./backend/database/docdetails");

const OtpManager = require("./OtpManager");
const otpRepository = require("./otpRepository");
const otpSender = require("./otpSender");
const user = require("./backend/database/schema");
const bookings=require("./backend/database/booking");

require("./backend/database/conn");
require("./backend/database/schema");
const dotenv = require("dotenv");
dotenv.config({ path: "./backend/config.env" });

const flash = require("connect-flash");
app.use(flash());

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
var finalPath = path.join(__dirname, "/client/views");
//console.log(finalPath);
const staticpath = path.join(__dirname, "/client/public");
const staticimages = path.join(__dirname, "/images");
//console.log(staticpath);
app.use(express.static(staticpath));
app.use(express.static(staticimages));
app.engine("html", ejs.renderFile);
app.set("view engine", "ejs");
app.set("views", finalPath);

app.use(
  session({
    cookie: { path: "/", maxAge: 1000 * 60 * 60 * 24 },
    secret: "KonfinitySecretKey",
    saveUninitialized: false,
    resave: false,
  })
);

const otpManager = new OtpManager(otpRepository, {
  otpLength: 4,
  validityTime: 4,
});

app.post("/otp/:token", async (req, res) => {
  const number = req.body.mobileno;
  var k = await user.findOne({ mobileno: number });

  user.findOne({ mobileno: number }).then((user) => {
    if (user) {
      const otp = otpManager.create(req.params.token);
      req.body.recieverNumber = "918119954633";
      console.log("Otp wala");
      console.log(req.body);
      req.session.otpnumber = number;
      console.log("req.session.user", req.session.otpnumber);
      req.session.name = k.name;
      otpSender.send(otp, req.body);
      console.log(`Your token code is ${otp.token} and otp is ${otp.code}`);
      req.flash("success", "Otp Has been sent to your Mobile Number");
      res.redirect("/otpenter");
    } else {
      
      req.flash("failed", "Invalid number");
      return res.redirect("/otpnumber");
    }
  });
});

//Verify Otp

app.post("/verifyotp/:token", async (req, res) => {
  var code =
    req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4;
  console.log(code);

  const verificationResults = otpManager.VerificationResults;
  const verificationResult = otpManager.verify(req.params.token, code);
  let statusCode;
  let bodyMessage;

  switch (verificationResult) {
    case verificationResults.valid:
      var exist = await User.findOne({ mobileno: req.session.otpnumber });
      if (exist.email == "admin@gmail.com" && exist.password == "admin@123") {
        const email=exist.email;
        const password=exist.password;
        req.session.user = { email, password };
        req.session.name = exist.name;
        req.session.email = exist.email;
        req.session.mobileno = exist.mobileno;
        req.session.gender = exist.gender;
        req.session.dateofbirth = exist.dateofbirth;
        req.session.isAdmin = true;

        return res.redirect("/adminpageget");
      }
      if (exist) {
        var checkpass = await User.findOne({
          mobileno: req.session.otpnumber
        });
        var findall = await docdetails.find();
        //console.log("finding length of doctor database");
        //console.log(findall.length);
        //console.log("checking prev slot id exists or not",!(req.session.prevslotid));
        if (checkpass) {
          console.log("authentication successful");
          const email=checkpass.email;
        const password=checkpass.password;
          //creating sessions
          req.session.user = { email, password };
          req.session.password = checkpass.password;
          req.session.name = checkpass.name;
          req.session.email = checkpass.email;
          req.session.mobileno = checkpass.mobileno;
          req.session.gender = checkpass.gender;
          req.session.dateofbirth = checkpass.dateofbirth;
          req.session.state = checkpass.state;
          req.session.isDoctor = checkpass.isDoctor;
          req.session.country = checkpass.country;
          req.session.city = checkpass.city;
          req.session.findall = findall;
          req.session.id = checkpass._id;
          req.session.image = checkpass.image;
          req.session.isAdmin = false;

          var doctor = await docdetails.findOne({ email: email });

          if (doctor) {
            req.session.description = doctor.description;
            req.session.hospitals = doctor.hospitals;
            req.session.achievements = doctor.achievements;
            req.session.exp = doctor.exp;
            req.session.qualification = doctor.qualification;
            req.session.awards = doctor.awards;
            req.session.specialization = doctor.specialization;
            req.session.fees = doctor.fees;
            req.session.image = doctor.image;
            req.session.docid = doctor.id;
          }
        }
      }

      req.flash("success", "Welcome");
      req.flash("success", "Login Successfull");

      return res.redirect("/index");
      break;
    case verificationResults.notValid:
      //req.flash("fail", "Failure");
      //req.flash("fail", "Invalid OTP");
      req.session.destroy(() => {
        console.log("session destroyed");
      });
      return res.redirect("/otpnumber");
      break;
    case verificationResults.checked:
      //req.flash("fail", "Failure");
      //req.flash("fail", "code already used");
      req.session.destroy(() => {
        console.log("session destroyed");
      });
      return res.redirect("/otpnumber");
      break;
    case verificationResults.expired:
      //req.flash("fail", "Failure");
      //req.flash("fail", "OTP expired");
      req.session.destroy(() => {
        console.log("session destroyed");
      });
      return res.redirect("/otpnumber");
      break;
    default:
      //req.flash("fail", "Failure");
      //req.flash("fail", "cannot send");
      req.session.destroy(() => {
        console.log("session destroyed");
      });
      return res.redirect("/otpnumber");
  }
  res.status(statusCode).send(bodyMessage);
});


//For edit mobile number
app.post("/editnumber/otp/:token", async (req, res) => {
  const number = req.body.mobilenoo;
  var k = await User.findOne({ mobileno: number });
  console.log("printing new number",number);

   
    if (!k) {
      
      const otp = otpManager.create(req.params.token);
      req.body.recieverNumber = "918119954633";
      console.log("Otp wala");
      console.log(req.body);
      req.session.otpnumber = number;
      console.log("req.session.user", req.session.otpnumber);
      
      otpSender.send(otp, req.body);
      console.log(`Your token code is ${otp.token} and otp is ${otp.code}`);
      req.flash("success", "Otp Has been sent to your Mobile Number");
      req.session.prevmob=req.session.mobileno;
      req.session.newmob=number;
      res.redirect("/otpverification");
    } else {
      
      req.flash("failed", "Mobile Number already Exists");
      return res.redirect("/profile");
    }
  
});





//Verify Otp

app.post("/editnumber/verifyotp/:token", async (req, res) => {
  var code =
    req.body.digit1 + req.body.digit2 + req.body.digit3 + req.body.digit4;
  console.log(code);

  const verificationResults = otpManager.VerificationResults;
  const verificationResult = otpManager.verify(req.params.token, code);
  let statusCode;
  let bodyMessage;

  switch (verificationResult) {
    case verificationResults.valid:
      var p=await User.findOne({mobileno:req.session.prevmob});
      var k= await User.findOneAndUpdate({mobileno:req.session.prevmob},
        {mobileno:req.session.newmob});
        if(p.isDoctor){
          await docdetails.findOneAndUpdate({mobileno:req.session.prevmob},
            {mobileno:req.session.newmob});
        }
        var b=await bookings.find({mobileno:req.session.prevmob});
        if(b){
          for(var k=0;k<b.length;k++){
            b[k].mobileno=req.session.newmob;
            await b[k].save();
          }
        }
        
        req.session.mobileno=req.session.newmob;
        
      return res.redirect("/profile");
      break;
    case verificationResults.notValid:
      //req.flash("fail", "Failure");
      //req.flash("fail", "Invalid OTP");
      req.session.destroy(() => {
        console.log("session destroyed");
      });
      return res.redirect("/profile");
      break;
    case verificationResults.checked:
      //req.flash("fail", "Failure");
      //req.flash("fail", "code already used");
      req.session.destroy(() => {
        console.log("session destroyed");
      });
      return res.redirect("/profile");
      break;
    case verificationResults.expired:
      //req.flash("fail", "Failure");
      //req.flash("fail", "OTP expired");
      req.session.destroy(() => {
        console.log("session destroyed");
      });
      return res.redirect("/profile");
      break;
    default:
      //req.flash("fail", "Failure");
      //req.flash("fail", "cannot send");
      req.session.destroy(() => {
        console.log("session destroyed");
      });
      return res.redirect("/profile");
  }
  res.status(statusCode).send(bodyMessage);
});


app.use("/", mainroute);



app.get("/demo",(req,res)=>{
  fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
})

app.get("*", (req, res) => {
  res.render("error", {
    isadmin: req.session.isAdmin,
  });
});
var port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server is listening");
});
