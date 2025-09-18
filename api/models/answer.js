import mongoose from 'mongoose';
const answerSchema = mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,required:true,ref:'users'},
    quizId:{type:String,required:true,ref:'Quiz'},
    answers:[
        {
            question:{type:mongoose.Types.ObjectId,required:true,ref:'Question'},
            visitedAt:{type:Date,default:null},
            answerdAt:{type:Date,default:null},
            answer:{
                qid:{type:Number,default:null},
                aid:{type:Number,default:null}
            },
            skippedAt:{type:Date,default:null},
            timeSpent:{type:Number,default:0}
        }
    ],
    completedAt:{type:Date,default:null},
    timeOut:{type:Date,default:null},
    timeSpent:{type:Number,default:null},
})

export default mongoose.models.answers || mongoose.model('answers',answerSchema);