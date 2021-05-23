const mongoose=require("mongoose");

const hospitalSchema=new mongoose.Schema(
    {
        name:{
            type:String
        },
        description:{
            type:String,
            
        },
        speciality:{
            type:String,
            required:true
        },
        image:{
            type:String
        },
        location:{
            type:String
        },
        beds:{
            type:Number
        },
        treatments:{
            type:String
        }
    
    })

    const hospitaldetails= mongoose.model("HOSPITALDETAIL", hospitalSchema);
    module.exports=hospitaldetails;