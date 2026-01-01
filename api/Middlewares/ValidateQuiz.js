import Quiz from "../models/quiz.js";

export default async function ValidateQuiz(req,res,next){
    const quizId = req.params.id;
    if(!quizId){
        return res.status(400).json({err:'Request Not Found !'});
    }
    try {
            const quiz = await Quiz.findOne({quizId}).select('-_id -updatedAt').populate('createdBy','username -_id');
            if(!quiz){
                console.log(quizId,'quiz not found');
                return res.status(404).json({err:'Request Not Found !'});
            }
            req.quiz = quiz;
            next();
        } catch (error) {
           
            return res.status(500).json({err:'Unexpected Error'});
        }
}