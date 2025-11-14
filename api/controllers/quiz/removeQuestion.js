import { all } from "axios";
import Answer from "../../models/answer.js";
import Question from "../../models/question.js";
import Quiz from "../../models/quiz.js";

export default async function removeQuestion(req,res) {
    const {user} = req;
    const {id,quiz} = req.query;

    console.log(id,quiz);
    try {
        const verify = await Quiz.findOne({quizId:quiz,createdBy:user.id});
        if(!verify) return res.status(403).json({err:'Access Denied'});

        const deleted = await Question.findByIdAndDelete(id);
        if(!deleted) return res.status(404).json({err:'Question not found'});

        // Also delete all answers related to this 
        await Answer.deleteMany({"answers.question":deleted._id});

        return res.status(200).json({success:true,msg:'Question deleted successfully',removed:deleted.id});
        

    } catch (error) {
        return res.status(500).json({err:'Unexpected Error'});
    }
}