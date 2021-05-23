const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
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
        city:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        isDoctor:{
            type:Boolean,
        },
        image:{
            type:String
        }
        


    
    })


    //generating token

    userSchema.methods.generateAuthToken= async function(){
        try{
            var token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
            this.tokens = this.tokens.concat({token:token});
            await this.save();
            return token;
        }
        catch(err){
            console.log(err);
        }
    }
    

    const User= mongoose.model("USER", userSchema);
    module.exports=User;