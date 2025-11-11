import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userId:mongoose.Types.ObjectId,
    username:{type:String,minLength:3,maxLength:50,required:true},
    email:{type:String,unique:true,required:true},
    profile:{
        url:{type:String,default:null},
        cloudId:{type:String,default:null},
    },
    password:{type:String,required:true},
    loginAttempts:{
        count:{type:Number,default:0},
        firstAt:{type:Date,default:null},
        lastAt :{type:Date,default:null}
    },
    isVerified:{type:Boolean,default:false},
    verfCode:{type:String,default:null},
    lastVerfCodeSentAt : {type:Date,default:null},
    verifyAttempts:{
        count:{type:Number,default:0},
        firstAttempt:{type:Date,default:null}
    },
})

export default mongoose.models.users || mongoose.model('users',userSchema);