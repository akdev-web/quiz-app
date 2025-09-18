import Quiz from "../models/quiz.js";

export default async function VerifyQuizOwnership(req,res,next){
    const {user} = req;
    const quizId = req.params.id;
    if(!quizId){
        return res.status(400).json({err:'Request Not Found !'});
    }
    try {
        const quiz = await Quiz.findOne({quizId,createdBy:user.id}).select(' -updatedAt');
        if(!quiz){
            return res.status(403).json({err:'Access Denied !'});
        }
        req.quiz = quiz;
        next();
    } catch (error) {
        return res.status(500).json({err:'Unexpected Error'});
    }
}