import answer from "../../models/answer.js";

export default async function quizResult(req, res,next) {
    const { user, quiz } = req;
    const { quizId } = quiz;
    try {
        const answers = await answer.find({ quizId }).populate('answers.question').limit(100);
        // check is user participated in quiz
        if (!answers) return res.status(404).json({ err: 'No one Participated in this quiz !' });

        const resultSummary = []; const resultDetails = [];

        answers.map((answers) => {
            //check if quiz completed the quiz by last answer 
            const lastAnswer = answers.answers[answers.answers.length - 1];
            const isCompleted = lastAnswer.answer.aid || lastAnswer.skippedAt;
            if (!isCompleted) return res.status(400).json({ err: 'Please Complete the quiz to see final result !' });

            // create a summary result
            const Summary = answers.answers.map((ans, i) => {
                const summary = { questionNo: i + 1, question: ans.question.quest, correct: false };
                if (ans.question.ans === ans.answer.aid) {
                    return { ...summary, correct: true };
                }
                return summary;
            })
            const Details = answers.answers.map((ans, i) => {
                if (ans.question.ans === ans.answer.aid) {
                    return {
                        question: ans.question,
                        correct: true,
                        skipped: false,
                        answer: ans.answer.aid,
                        timespent: ans.timeSpent,
                    }
                }
                if (!ans.answer.aid || ans.answer.skippedAt) {
                    return {
                        question: ans.question,
                        correct: false,
                        skipped: true,
                        answer: ans.answer.aid,
                        timespent: ans.timeSpent,
                    }
                }
                return {
                    question: ans.question,
                    correct: false,
                    skipped: false,
                    answer: ans.answer.aid,
                    timespent: ans.timeSpent,
                }
            })
            resultDetails.push(Details);
            resultSummary.push(Summary);
        })

        return res.status(200).json({ success: true, msg: 'result !', resultDetails, resultSummary, timespent: answers.timeSpent });
    } catch (error) {
        next(error);
        return res.status(500).json({err:'Unexpected Error'});
    }
}