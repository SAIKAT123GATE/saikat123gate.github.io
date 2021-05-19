var express = require("express");
const User = require("../database/schema");
const mongoose = require("mongoose");
const docdetails = require("../database/docdetails");
const schedules = require("../database/appointment");
const medicalreport = require("../database/medicalreport");
const multer=require('multer');


const getslots = async(req,res)=>{
    const id=req.params.id;
    var findsch=await schedules.find({createdby:id});
    //console.log(findsch);
    

    var slotsnum=[0,0,0,0,0,0,0];
    var darray=new Array("sunday","monday","tuesday","wednesday","thursday","friday","saturday");
  var comparearray=[];
  for(var l=0;l<7;l++){
    var date=new Date();
    var day=date.getDay()+l;
    
    if(day<7)
    comparearray.push(darray[day]);
    else
    comparearray.push(darray[day-7]);


  }
    if(findsch){
      
      //console.log("printing schedule",findsch);
      for(var p=0;p<7;p++){
        for(var a=0;a<findsch.length;a++){
        if(comparearray[p]==findsch[a].days){
          for(var s=0;s<findsch[a].slots.length-1;s++){
            if((!findsch[a].slots[s].isDisabled)&&(!findsch[a].slots[s].isBooked))
            slotsnum[p]+=1;
          }
        }
          
          
        }
      }
    }
    
    //console.log("printing slots",slotsnum);
    res.status(200).send(slotsnum);

}



//Get slots

const getsubslots=async (req,res)=>{
  const id1= req.params.did;
  
  var index=parseInt( req.params.index);
  var morning=[];
  var afternoon=[];
  var evening=[];
  var date1=new Date();
  var day=(date1.getDay()+index);
  if(day>7){
    day=day-7;
  }
  console.log(day);
  switch(day){
    case 0:
    var nameday = "sunday";
    break;
  case 1:
    var nameday = "monday";
    break;
  case 2:
     var nameday = "tuesday";
    break;
  case 3:
    var nameday = "wednesday";
    break;
  case 4:
    var nameday = "thursday";
    break;
  case 5:
    var nameday = "friday";
    break;
  case 6:
    var nameday = "saturday";
}
//console.log("printing todays bar",nameday);

var findsch1=await schedules.findOne({createdby:id1,days:nameday});
if(findsch1){
  
  var b=findsch1._id;
  var slotsarray=findsch1.slots;
  //console.log("printing slotsarray",slotsarray);
  for(var s=0;s<slotsarray.length-1;s++){
    var time=slotsarray[s].time.split(":");
    time=parseInt(time);
    //console.log("printing time",time);
    if(time<12 && !(slotsarray[s].isBooked) && !(slotsarray[s].isDisabled)){
      morning.push(slotsarray[s]);
    }
    else if(time>12 && time<18 && !(slotsarray[s].isBooked) && !(slotsarray[s].isDisabled)){
      afternoon.push(slotsarray[s]);
    }
    else if(time>18  && !(slotsarray[s].isBooked) && !(slotsarray[s].isDisabled)){
      evening.push(slotsarray[s]);
    }
  }
}
//console.log("printing afternoon",afternoon);

res.status(200).send([morning,afternoon,evening,b]);

}



//Onclick slots handling post request
const onslotclick=async(req,res)=>{
  var scheduleid=req.params.scheduleid;
  var doctorid=req.params.doctorid;
  var slotid=req.params.slotid;
  var slottime=req.params.slottime;
  req.session.slotbookingtime=slottime;
  var doc= await docdetails.findOne({_id:doctorid});
  req.session.docnameforbook=doc.name;
  /* this section is for qualification */
  var qualification=doc.qualification;
  var quali=JSON.parse(qualification);
  var str='';
  for(var p=0;p<quali.length;p++){
    str=str+quali[p].value+" ";
  }
  req.session.qualification=str;
  //**************************************************** */

  //this section is for hospital
  var hospital=doc.hospitals;
  var hospi=JSON.parse(hospital);
  var str='';
  for(var p=0;p<hospi.length;p++){
    str=str+hospi[p].value+" ";
  }
  req.session.hospital=str;

  //***************************************************************** */

  /* getting the image*/
  req.session.docimg=doc.image;

  /*finding date */
  var findschedule= await schedules.findOne({_id:scheduleid});
  var day=findschedule.days;
  console.log("printing day",day);
  switch(day){
    case "sunday":
      var dayno=0;
      break;
    case "monday":
      var dayno=1;
      break;
    case "tuesday":
        var dayno=2;
        break;
    case "wednesady":
      var dayno=3;
      break;
    case "thursday":
        var dayno=4;
        break;
    case "friday":
        var dayno=5;
        break;
        case "saturady":
          var dayno=6;
          break;
  }

  if(req.session.isDoctor){
    console.log("doc can't book appointment as a doc");
    return res.redirect("/doctor");
  }
  else{
    return res.redirect("/booking/"+scheduleid);
  }
}

module.exports={
    getslots:getslots,
    getsubslots:getsubslots,
    onslotclick:onslotclick
}