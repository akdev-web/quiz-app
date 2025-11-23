import answer from "../../models/answer.js";
import question from "../../models/question.js";

export default async function progress(req,res,next) {
    const {user,quiz} = req;
    try {
        const timeNow =  Date.now();

        //get all questions of quiz
        const questions = await question.find({quizId:quiz.quizId});
        // ... check progress if user participated before 
        const participated = await answer.findOne({quizId:quiz.quizId,userId:user.id});
         
        if(participated){
            
            // check if quiz completed by user 
            if(participated.completedAt){
                    return res.status(200).json({success:true,completed:true,msg:'quiz completed successfully !'});
            }

            // check if  timeout
            if(participated.timeOut && (timeNow > new Date(participated.timeOut).getTime() ) ){
 
                const remainAnswers = [];
                questions.forEach((qes,idx)=>{
                    if(idx < participated.answers.length) return;
                    remainAnswers.push({
                        answer:{qId:qes.id,aid:null},
                        question:qes._id,
                    })
                })
                const allAnswers = [...participated.answers, ...remainAnswers];

                participated.answers = allAnswers;
                participated.completedAt = timeNow;
                participated.timeSpent = timeNow - new Date(participated.answers[0].visitedAt).getTime();
                await participated.save();

                return res.status(200).json({success:true,completed:true,msg:'quiz Timeout !'});
            } 

            // return progress of quiz 
            let current = null;
            let index = 0;
            for (const answer of participated.answers) {
                if(!answer.answerdAt){
                    
                    if(index===0){
                        const timeTillFirstVisit = Date.now() - new Date(answer.visitedAt) 
                        if(timeTillFirstVisit > 1000*60*10) answer.visitedAt = Date.now();
                    }
                    current = answer.question;
                    break;
                } 
                index++;
            }
            await participated.save();
            const qIndex = questions.findIndex(q=>q._id.equals(current))+1;
            return res.status(200).json({success:true,msg:'participated before !',current,qIndex,timeout:participated.timeOut});
        }

        const current = questions[0]._id;
        const answers = new answer({
            quizId:quiz.quizId,
            userId:user.id,
            answers:[
                {question:current,visitedAt:timeNow}
            ]
        });
        if(quiz.timer?.duration){
            answers.timeOut= new Date(timeNow+(quiz.timer.duration*1000)).toISOString();
        }
        await answers.save();
        const qIndex = 1;
        return res.status(200).json({success:true,msg:'participated successfully !',data:answers,current,qIndex});
    } catch (error) {
        next(error);
        return res.status(500).json({err:'Unexpected Error'});
    }
}