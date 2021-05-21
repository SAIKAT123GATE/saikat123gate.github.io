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
const getslot=require("../controller/getscheduleslots");
const getscheduleslots = require("../controller/getscheduleslots");
const schedules = require("../database/appointment");
const myappointment=require("../controller/myappointment");
const admincontroller=require("../controller/admincontroller");


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
router.route("/booking/:scheduleid").get(sessionauth.redirectlogin,middle.bookingpageget);
router.route("/addschedule").get(sessionauth.redirectlogin,schedule.getschedule);
router.route("/addschedule").post(schedule.addschedule);
router.route("/settings").get(sessionauth.redirectlogin,middle.settingspageget);
router.route("/changepassword").post(middle.changepassword);
router.route("/medicalreport").get(sessionauth.redirectlogin,middle.medicalreportget);
router.route("/addmedicalreport").post(middle.medicalreportpost);
router.route("/deletemedicalrecords/:id").post(middle.deletemedicalrecords);
router.route("/docprofile").get(sessionauth.redirectlogin,middle.docprofile);
router.route("/getschedule/:id").get(getscheduleslots.getslots);
router.route("/getslots/:did/:index").get(getscheduleslots.getsubslots);
router.route("/removeslots/:scheduleid").post(schedule.removeschedule);
router.route("/disableslot/:scheduleid/:slotid").post(schedule.disableslot);
router.route("/disableallschedule/:scheduleid").post(schedule.disableallslot);
router.route("/bookslot/:scheduleid/:doctorid/:slotid/:slottime").post(getscheduleslots.onslotclick);
router.route("/booking/:scheduleid").post(getscheduleslots.saveappointment);
router.route("/confirmappointment").get(sessionauth.redirectlogin,getscheduleslots.appointment);
router.route("/myappointments").get(sessionauth.redirectlogin,myappointment.myappointment);
router.route("/deleteappointment/:scheduleid/:slotid").post(myappointment.deleteappointment);
router.route("/rescheduleappointment/:scheduleid/:slotid").post(myappointment.reschedule);
router.route("/adminpageget").get(admincontroller.admindashboard);
router.route("/adminusers").get(admincontroller.adminusers);
router.route("/admindoctors").get(admincontroller.admindoctors);
router.route("/adminhospitals").get(admincontroller.adminhospitals);

module.exports=router;

