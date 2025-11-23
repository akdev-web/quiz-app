import question from '../../models/question.js'
import Quiz from '../../models/quiz.js';
export default async function addQuiz(req, res,next) {
    const { quizId, quiz } = req.body;
    if (!quizId, !quiz) {
        return res.status(400).json({ err: 'quiz detials not available' });
    }   


    try {
        //check if quiz exists with this id ?
        const _quiz = await Quiz.findOne({ quizId }).select('_id');
        if (!_quiz) { return res.status(404).json({ err: 'Request Not Found !' }); }

        //if new questions then add quizId and Insert 
        const _questions = quiz.flatMap((q)=> q._id ? [] : {...q,quizId:quizId});
        if(_questions.length > 0){ 
            await question.insertMany(_questions);
            const totalQuestions = await question.countDocuments({quizId});
            _quiz.totalQuestions = totalQuestions;
            await _quiz.save();
        }


        // if already in database then update them 
        const _update = quiz.filter((question) => question._id != null)
        if (_update.length > 0) {
            await question.bulkWrite(
                _update.map((q) => ({
                    updateOne: {
                        filter: { _id: q._id },
                        update: {
                            $set: {
                                ...(q.id !== undefined && { id: q.id }),
                                ...(q.quest !== undefined && { quest: q.quest }),
                                ...(q.ans !== undefined && { ans: q.ans }),
                                ...(q.options !== undefined && { options: q.options }),
                                ...(q.duration !== undefined && { duration: q.duration })
                            }
                        }
                    }
                }))
            )
        }

        const updated = await  question.find({quizId});
        return res.status(200).json({success:true,msg:'questions updated successfully !',data:updated});

    } catch (error) {
        next(error);
        return res.status(500).json({ err: 'Unexpected Error' });
    }
}