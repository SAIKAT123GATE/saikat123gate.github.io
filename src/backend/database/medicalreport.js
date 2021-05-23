const mongoose=require("mongoose");

const reportschema=new mongoose.Schema({
    email:{
        type:String
    },
    title:{
        type:String
    },
    date:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    image:{
        type:Array
    },
    report:{
        type:String,
        require:true
    }
})

const reportdeatils=mongoose.model("REPORT",reportschema);
module.exports=reportdeatils;