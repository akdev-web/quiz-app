import answer from "../../models/answer.js";

export default async function quizResult(req,res) {
    const {user,quiz} = req;
    const {quizId} = quiz;
    try {
        const answers = await answer.findOne({userId:user.id,quizId}).populate('answers.question');
        // check is user participated in quiz
        if(!answers) return res.status(404).json({err:'You have not participated in this quiz !',participated:false});

        //check if user completed the quiz by last answer 
        if(!answers.completedAt) return res.status(400).json({err:'Please Complete the quiz to see final result !'});
        

        const resultSummary  = [];
        const resultDetails = [];
        answers.answers.forEach((ans,i)=>{
            const summary = {questionNo:i+1,question:ans.question.quest,correct:false};
            
            console.log(ans);
            const skipped = !isNaN( new Date( ans.answer.skippedAt ).getTime() );
            const answerd = ans.answer.aid != null && !isNaN(ans.answer.aid) 
            const correct = answerd &&  (ans.answer.aid === ans.question.ans)
            const timeout = !answerd && !skipped
  
            resultSummary.push({...summary,skipped,correct,timeout});

            resultDetails.push({
                    question:ans.question,
                    correct,
                    skipped,
                    timeout,
                    answer:ans.answer.aid,
                    timespent:ans.timeSpent,
            });
        })
        
        res.status(200).json({success:true,msg:'result !',resultDetails,resultSummary,timespent:answers.timeSpent});
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Unexpected Error !'});
    }
}