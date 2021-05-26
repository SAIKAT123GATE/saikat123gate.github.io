const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String
        },
        email:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
            
        },
        hospitals:{
            type:String,
            required:true
        },
        achievements:{
            type:String,
            required:true
        },
        exp:{
            type: Number,
            required:true
        },
        qualification:{
            type:String,
            required:true
        },
        
        awards:{
            type:String,
            required:true
        },
        specialization:{
            type:String,
            required:true
        },
        fees:{
          type:Number, 
          required:true 
        },
        image:{
            type:String
        },
        city:{
            type:String
        },
        gender:{
            type:String,
            required:true
        },
        dateofbirth:{
            type:String,
            required:true
        },
        mobileno:{
            type:Number,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }
    
    })

    const docdetails= mongoose.model("DOCDETAIL", userSchema);
    module.exports=docdetails;