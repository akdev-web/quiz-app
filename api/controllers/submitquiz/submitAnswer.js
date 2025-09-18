import mongoose from 'mongoose';
import answer from '../../models/answer.js';
import Question from '../../models/question.js'
export default async function submitAnswer(req, res) {

    const { user, quiz } = req;
    const { ans, question } = req.body;
    const questId = req.params.quest;
    if (!ans || !questId) {
        return res.status(400).json({ err: 'No Answer Replied or Invalid' });
    }
    try {
        const questId = question._id;
        const questIndex = question.id;
     
        const _question = await Question.findById(questId);
        if (!_question) return res.status(400).json({ err: 'answered question does not exists !' });


        const answers = await answer.findOne({ userId: user.id, quizId: quiz.quizId });

        const timeNow = Date.now();

        // if quiz has a duration and time is over 
        if(answers && quiz.timer?.duration){
            if(timeNow > answers.timeOut && !answers.completedAt){
                const allQuestions =  await Question.find({quizId:quiz.quizId});

                const remainAnswers = [];
                allQuestions.foreach((qes,idx)=>{
                    if(answers.answers.length < (idx+1) ) return;
                    remainAnswers.push({
                        answer:{qId:qes.id,aid:null},
                        question:qes._id,
                    })
                })

                answers.answers = [...answers.answers, remainAnswers];
                answers.timeOut = timeNow;
                answers.completedAt = timeNow;
                answers.timeSpent = timeNow - new Date(answers.answers[0].visitedAt).getTime();
                await answers.save();

                return res.status(200).json({success:true,completed:true,msg:'quiz Timeout !'});
            } 
        }

        if (answers) {
            
            // set current answer
            answers.answers.forEach(answ => {
                if (answ.question.equals(questId)) {
                    const timespent = timeNow-new Date(answ.visitedAt)
                    answ.answerdAt = timeNow;
                    answ.answer = { qid: questIndex, aid: ans };
                    answ.timeSpent= timespent;
                    return;
                }
            });
           

            // intialise next answer
            const questions = await Question.find({quizId:quiz.quizId}).select('_id');
            const currentIndex = questions.findIndex(q => q._id.equals(questId));
            const nextIndex = currentIndex + 1;
            const nextQuestion = questions[nextIndex]?._id;

            if(!nextQuestion){
                const firstVisit = new  Date(answers.answers[0].visitedAt);
                answers.completedAt= timeNow;
                answers.timeSpent =  timeNow - firstVisit;
                await answers.save(); //save current answer 
                return res.status(200).json({success:true,completed:true,msg:'quiz completed successfully !'});
            }

            const qIndex = nextIndex + 1; // question No. 

            answers.answers = [...answers.answers,{
                question:nextQuestion,visitedAt:Date.now()
            }];

            await answers.save(); //save current answer and init next 
            return res.status(200).json({ success: true, msg: 'saved successfully',qIndex,current:nextQuestion})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({err:'Unexpected Error'});
    }

}