
import Quiz from '../../models/quiz.js'
import {nanoid }from 'nanoid';
export default async function newQuiz(req,res,next){
    const new_ = req.body;


    new_.schedule = null;
    new_.published = false; 
    
    try {

        const id = nanoid(10);
        const createdBy = req.user.id;
        const new_quiz = {...new_,quizId:id,createdBy};
        const duration = parseInt(new_.duration);
        if(!isNaN(duration) && duration > 0  ){
            new_quiz.timer = {
                avail:true,
                duration
            };
        }

        const newQuiz = await Quiz.create(new_quiz);
        if(newQuiz){
            const {_id,updatedAt,...quizData} = newQuiz.toObject() ;
            return res.status(200).json({success:true,msg:'Quiz Created',data:quizData});
        }
    
    } catch (error) {
        next(error);
        return res.status(500).json({err:'Unexpected Error'});
    } 
}