const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        description:{
            type:String,
            required:true
        },
        hospitals:{
            type:String,
            
        },
        achievements:{
            type:String,
            
        },
        exp:{
            type: Number,
            
        },
        qualification:{
            type:String,
            
        },
        
        awards:{
            type:String,
        
        },
        specialization:{
            type:String,
            
        },
        fees:{
          type:Number  
        }
    
    })

    const docdetails= mongoose.model("DOCDETAIL", userSchema);
    module.exports=docdetails;