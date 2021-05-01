var express=require("express");
var router=express.Router();
var path=require('path');
const loginc=require("../controller/logincontroller");
const signupc=require("../controller/signupcontroller");
const middle=require("../controller/middle");
const sessionauth=require("../controller/sessionauth");

router.route("/").get(loginc.loginuser);
router.route("/").post(loginc.loginauth);
router.route("/signup").get(signupc.signupuser);
router.route("/signup").post(signupc.signupregister);
router.route("/index").get(sessionauth.redirectlogin,middle.indexget);
router.route("/doctor").get(sessionauth.redirectlogin,middle.doctorpageget);
router.route("/hospital").get(sessionauth.redirectlogin,middle.hospitalpageget);
router.route("/treatment").get(sessionauth.redirectlogin,middle.treatmentpageget);
router.route("/aboutUs").get(sessionauth.redirectlogin,middle.aboutpageget);
router.route("/otpnumber").get(middle.otpnumberpageget);
//post request for otp number page is handling from app.js via otp service manager
router.route("/otpenter").get(middle.otpenterpageget);

router.route("/docdetails").get(middle.docdetails);

module.exports=router;

