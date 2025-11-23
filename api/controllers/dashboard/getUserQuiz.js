
import quiz from '../../models/quiz.js';
export default async function getUserQuiz(req, res,next) {
    const userId = req.user.id;

    try {
        const result = await quiz.aggregate([
            {
                $match: { createdBy: userId }
            },
            {
                $lookup: {
                    from: "answers",
                    let:{quizId:'$quizId'},
                    pipeline:[
                        {
                            $match:{
                                $expr:{
                                    $and:[
                                        {$eq:['$quizId','$$quizId']},
                                        {$ifNull:['$completedAt',false]}
                                    ]
                                }
                            }
                        }
                    ],
                    as: "participants"
                }
            },
            {
                $addFields: {
                    totalParticipants: {
                        $size: "$participants"
                    }
                }
            },
            {
                $unwind: {
                    path: "$participants",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$participants.answers",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "questions",
                    localField: "participants.answers.question",
                    foreignField: "_id",
                    as: "questionData"
                }
            },
            {
                $unwind: {
                    path: "$questionData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    isCorrect: {
                        $cond: [
                            {
                                $eq: [
                                    "$participants.answers.answer.aid",
                                    "$questionData.ans"
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: {
                        quizId: "$quizId",
                        userId: "$participants.userId"
                    },
                    correctCount: {
                        $sum: "$isCorrect"
                    },
                    timeSpent: {
                        $first: "$participants.timeSpent"
                    },
                    totalParticipants: {
                        $first: "$totalParticipants"
                    }
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"_id.userId",
                    foreignField:"_id",
                    as:"userdata"
                }
            },
            {
                $unwind:{
                    path:"$userdata",
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $group: {
                    _id: "$_id.quizId",
                    totalParticipants: {
                        $first: "$totalParticipants"
                    },
                    topusers: {
                        $push: {
                            username: "$userdata.username",
                            timespent: "$timeSpent",
                            correctCount: "$correctCount",
                        }

                    }

                }
            },
            {
                $addFields: {
                    topParticipants: {
                        $cond: [
                            {
                                $gt: ["$totalParticipants", 0]
                            },
                            {
                                $slice: [
                                    {
                                        $sortArray: {
                                            input: "$topusers",
                                            sortBy: { correctCount: -1, timeSpent: 1 }
                                        }
                                    },
                                    3
                                ]
                            }
                            ,
                            false
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "quizzes",
                    localField: "_id",
                    foreignField: "quizId",
                    as: "quiz"
                },
            },
            {
                $unwind: {
                    path: "$quiz",
                }
            },
            {
                $project: {
                    topusers: 0
                }
            }


        ]);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
        return res.status(500).json({ err: 'Unexpected Error' });
    }
}