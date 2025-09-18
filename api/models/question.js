import mongoose from "mongoose";

const questSchema = mongoose.Schema({
    quizId:{type:String,required:true,ref:'Quiz'},
    id:{type:Number,required:true},    
    quest:{type:String,required:true},
    ans:{type:Number,required:true},
    options:[
        {_id:false,id:{type:Number,required:true},option:{type:String,required:true}}
    ],
    duration:{type:Number,default:null}
})

export default mongoose.models.Question || mongoose.model('Question',questSchema) 