const mongoose=require('mongoose');

const slots=new mongoose.Schema({
    time:{
        type:String
    },
    days:{
        type:String
    },
    isBooked:{
        type:Boolean
    },
    isDisabled:{
        type:Boolean
    }
})

const schedule=new mongoose.Schema({
    email:{
        type:String
    },

    days:{
        type:String
    },
    hospital:{
        type:String
    },
    fromtime:{
        type:String
    },
    totime:{
        type:String
    },
    interval:{
        type:Number
    },
    createdby:{
        type:String
    },
    date:{
        type:String
    },
    slots:[slots]
})

const schedules= mongoose.model("SCHEDULE", schedule);
    module.exports=schedules;