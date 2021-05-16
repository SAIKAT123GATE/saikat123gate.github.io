var express=require("express");
var router=express.Router();
var path=require('path');
const loginc=require("../controller/logincontroller");
const signupc=require("../controller/signupcontroller");
const middle=require("../controller/middle");
const sessionauth=require("../controller/sessionauth");
const docdetailsc=require("../controller/docdetailscontroller");
const multer=require('multer');
const docdetails = require("../database/docdetails");
const schedule=require("../controller/schedule");


const fileStorageEngine=multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'images')
    },
    
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
      },
    
    
});

const upload=multer({ storage:fileStorageEngine });




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

router.route("/docdetails").get(docdetailsc.docdetailsget);
router.route("/docdetails").post(upload.single('image'),docdetailsc.docdetailsregister);
router.route("/tvastraplus").get(middle.tvastraplus);
router.route("/logout").get(middle.logout);
router.route("/profile").get(sessionauth.redirectlogin,middle.profilepageget);
router.route("/updateprofile").post(upload.single('image'),docdetailsc.updateprofile);
router.route("/booking").get(middle.bookingpageget);
router.route("/addschedule").get(sessionauth.redirectlogin,schedule.getschedule);
router.route("/addschedule").post(schedule.addschedule);
router.route("/settings").get(sessionauth.redirectlogin,middle.settingspageget);
router.route("/changepassword").post(middle.changepassword);
router.route("/medicalreport").get(sessionauth.redirectlogin,middle.medicalreportget);
router.route("/addmedicalreport").post(middle.medicalreportpost);
router.route("/deletemedicalrecords/:id").post(middle.deletemedicalrecords);
router.route("/docprofile").get(sessionauth.redirectlogin,middle.docprofile);
module.exports=router;

