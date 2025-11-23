import mongoose from "mongoose";
import Answer from "../../models/answer.js";

export default async function dashBoardResult(req, res,next) {
    const { user, quiz } = req;
    const { quizId } = req.params;
    const { user: queryUser } = req.query;

    try {
        if (!queryUser) {
            // get rank list
            const answers = await Answer.aggregate(
                [
                    {
                        $match: {
                            quizId: quizId,
                            completedAt:{$ne:null},
                        }
                    },
                    {
                        $unwind: {
                            path: '$answers',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: 'questions',
                            localField: 'answers.question',
                            foreignField: '_id',
                            as: 'question'
                        }
                    },
                    {
                        $unwind: {
                            path: '$question',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $addFields: {
                            iscorrect: {
                                $cond: [
                                    { $eq: ['$answers.answer.aid', '$question.ans'] }, 1, 0
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: ['$userId', '$quizId'],
                            correctCounts: {
                                $sum: '$iscorrect'
                            },
                            inCorrectCounts: {
                                $sum: {
                                    $cond: [
                                        { $eq: ['$iscorrect', 0] }, 1, false
                                    ]
                                }
                            },
                            userId: { $first: '$userId' },
                            quizId: { $first: '$quizId' },
                            timeSpent: { $first: '$timeSpent' }

                        }
                    },
                    {
                        $sort: {
                            correctCounts: -1,
                            timeSpent: 1
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $unwind: {
                            path: '$user',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            userId: 1,
                            quizId: 1,
                            correctCounts: 1,
                            inCorrectCounts: 1,
                            user: {
                                name: '$user.username',
                                email: '$user.email'
                            },
                            timeSpent: 1
                        }
                    }

                ]
            );

            return res.status(200).json({ success: true, msg: 'Rank List !', rankList: answers });
        }

        else {
            const result = await Answer.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$quizId', quizId] },
                                { $eq: ['$userId', new mongoose.Types.ObjectId(queryUser)] }
                            ]
                        }
                    }
                },
                {
                    $unwind: {
                        path: '$answers',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'questions',
                        localField: 'answers.question',
                        foreignField: '_id',
                        as: 'questionData'
                    }
                },
                {
                    $unwind: {
                        path: '$questionData',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        iscorrect: {
                            $cond: [
                                { $eq: ['$answers.answer.aid', '$questionData.ans'] },
                                true, false
                            ]
                        },
                        status:{
                            $cond:[
                                {$ne: [ {$ifNull:['$answers.skippedAt', null]}, null]},
                                'skipped',
                                {
                                    $cond:[
                                        {$ne: [ {$ifNull:['$answers.answerdAt', null]}, null]},
                                        {
                                            $cond: [
                                                {$eq: ['$answers.answer.aid', '$questionData.ans'] },
                                                'correct', 'incorrect'
                                            ]
                                        },
                                        'timeout'
                                    ]
                                },
                            ]
                        },

                    }
                },

                {
                    $group: {
                        _id: '$_id',
                        quizId: { $first: '$quizId' },
                        userId: { $first: '$userId' },
                        answers: {
                            $push: {
                                question: '$questionData',
                                answer: '$answers.answer.aid',
                                status: '$status',
                                correct: '$iscorrect',
                                timespent: '$answers.timeSpent'
                            }
                        },
                        timespent:{$first:'$timeSpent'}
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: {
                        path: '$user',
                        preserveNullAndEmptyArrays: true      
                    }
                },
                {
                    $project: {
                        _id: 0,
                        quizId: 1,
                        user:{
                            name: '$user.username',
                            email: '$user.email'
                        },
                        resultDetails:'$answers',
                        timespent:1
                    }
                }


            ]);
            const finalResult = result[0];
            if(!finalResult) return res.status(404).json({ err: 'Result Not Found !' });
            return res.status(200).json({ success: true, msg: 'Participant Result !', result:finalResult});
        }
    }
    catch (error) {
        next(error);
        return res.status(500).json({ err: 'Unexpected Error !' });
    }
}