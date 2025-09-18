import mongoose from 'mongoose';
const quizSchema =mongoose.Schema({
    quizId:{type:String,length:10,unique:true},
    title:{type:String,minLength:10},
    description:{type:String,minLength:10},
    category:{type:String},
    thumbnail:{
        url:{type:String},
        cloudId:{type:String}
    },
    published:{type:Boolean,default:false},
    schedule:{type:Date,default:null},
    timer:{
        avail:{type:Boolean,default:false},
        duration:{type:Number,default:0}
    },
    totalQuestions:{type:Number,default:0},
    createdBy:{type:mongoose.Types.ObjectId,ref:'users'},
},{timestamps:true})

export default mongoose.models.Quiz || mongoose.model('Quiz',quizSchema);