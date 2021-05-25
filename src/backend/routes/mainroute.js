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
router.route("/tvastraplus").get(sessionauth.redirectlogin,middle.tvastraplus);
router.route("/logout").get(middle.logout);
router.route("/profile").get(sessionauth.redirectlogin,middle.profilepageget);
router.route("/updateprofile").post(upload.single('image'),docdetailsc.updateprofile);
router.route("/booking/:scheduleid").get(sessionauth.redirectlogin,middle.bookingpageget);
router.route("/addschedule").get(sessionauth.redirectlogin,schedule.getschedule);
router.route("/addschedule").post(schedule.addschedule);
router.route("/settings").get(sessionauth.redirectlogin,middle.settingspageget);
router.route("/changepassword").post(middle.changepassword);
router.route("/medicalreport").get(sessionauth.redirectlogin,middle.medicalreportget);
router.route("/addmedicalreport").post(upload.array('files',2),middle.medicalreportpost);
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
router.route("/rescheduleappointment/:scheduleid/:slotid/:docid").post(myappointment.reschedule);
router.route("/adminpageget").get(sessionauth.adminauth,admincontroller.admindashboard);
router.route("/adminusers").get(sessionauth.adminauth,admincontroller.adminusers);
router.route("/admindoctors").get(sessionauth.adminauth,admincontroller.admindoctors);
router.route("/adminhospitals").get(sessionauth.adminauth,admincontroller.adminhospitals);
router.route("/reschedule").get(sessionauth.redirectlogin,getscheduleslots.reschedule);
router.route("/appointment/:id").get(sessionauth.adminauth,admincontroller.adminappointment);
router.route("/:email/editprofile").get(sessionauth.adminauth,admincontroller.editpageget);
router.route("/:email/editprofile").post(upload.single('image'),admincontroller.editprofile);
router.route("/:id/showrecords").get(sessionauth.redirectlogin,middle.showrecords);
router.route("/:id/addmedicalreport").post(upload.array('files',2),middle.addmedicalimage);
router.route("/:id/:index/deletemedicalrecords").post(middle.deletemedicalimage);
router.route("/medicalrecord/:email").get(sessionauth.adminauth,admincontroller.medicalrecordget);
router.route("/:id/:email/admindeletemedicalrecords").post(admincontroller.admindeletemedicalreport);
router.route("/:id/edithospital").get(sessionauth.adminauth,admincontroller.editadminhospital);
router.route("/:id/savehospital").post(upload.single('image'),admincontroller.saveedithospital);
router.route("/sort").post(middle.sortby);
router.route("/addfilter").post(middle.filterfunction);
router.route("/getquote").get(admincontroller.getquote);
router.route("/abouthospital").get(admincontroller.abouthospital);
module.exports=router;

