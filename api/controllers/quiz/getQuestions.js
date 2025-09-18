import Question from "../../models/question.js";

export default async function getQuestions(req,res) {
    const quiz = req.quiz;
    const questId = req.params.quest;
    try {
        if(!questId){ // if no question id then result all questions
            const questions = await Question.find({quizId:quiz.quizId});
            return res.status(200).json({success:true,data:questions,quiz});
        }
        else{ // else return specific question
            const question = await Question.findById(questId);

            const {ans,...quest} = question.toObject();
            return res.status(200).json({success:true,data:quest});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({err:'Unexpected Error'});
    }
}