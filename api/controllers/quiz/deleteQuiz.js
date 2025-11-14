import Quiz from '../../models/quiz.js'
import Question from '../../models/question.js'
import Answer from '../../models/answer.js'
import cloudinary from '../../config/cloudinary.js'

export default async function deleteQuiz(req,res) {
    const {user,quiz} = req;
    try {
        // Delete quiz thumbnail from Cloudinary if exists
        if (quiz.thumbnail?.cloudId) {
                 await cloudinary.uploader.destroy(quiz.thumbnail.cloudId, { resource_type: 'image' });
        }
        // Delete all questions related to this quiz
        await Question.deleteMany({ quizId: quiz.quizId });
        // Delete all answers related to this quiz
        await Answer.deleteMany({ quizId: quiz.quizId });
        // Delete the quiz itself
        const deleted = await Quiz.findByIdAndDelete(quiz._id);
        return res.status(200).json({success:true,msg:'Quiz, thumbnail, and all related questions/answers deleted successfully!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({err:'Unexpected Error'});
    }
}