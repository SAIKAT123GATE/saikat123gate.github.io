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
    console.log(findsch);
    

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
        if(comparearray[p]==findsch[a].days)
          slotsnum[p]+=(findsch[a].slots.length-1);
        }
      }
    }
    
    console.log("printing slots",slotsnum);
    res.status(200).send(slotsnum);

}
module.exports={
    getslots:getslots
}