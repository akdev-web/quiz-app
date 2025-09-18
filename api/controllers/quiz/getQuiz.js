
import quiz from '../../models/quiz.js';
export default async function getQuiz(req,res) {
    const userId = req.user.id;

    try {
        // set pulished that shceduled before request
        const now = new Date();
        
        
        const updated =await quiz.updateMany(
            {
                published: false,
                $and:[
                    {schedule:{$ne:null}},
                    {schedule:{$lt:now}}
                ]
            },
            { $set: { published: true } }
        );

        const quizess = await quiz.aggregate([
            {
                $match: { 
                    $expr: { 
                        $or: [
                            {$eq: ['$published', true]} ,
                            {$ne: ['$schedule', null]} 
                        ] 
                    }
                }
            },
            {
                $sort: { schedule: -1 }
            },
            {
                $lookup: {
                    from: 'answers',
                    let: { quizId: '$quizId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$quizId', '$$quizId'] },
                                        { $eq: ['$userId', userId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'userAnswer'
                }
            },
            {
                $unwind:{
                    path:'$userAnswer',
                    preserveNullAndEmptyArrays:true
                }
            },
            {
                $addFields: {
                    participated: {
                        $cond:[
                            {$ifNull:['$userAnswer._id',false]},
                            true,false
                        ]
                    },
                    completed:{
                        $cond:[
                            {$ifNull:['$userAnswer.completedAt',false]},
                            true,false
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {
                $unwind: {
                    path: '$creator',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    quizId: 1,
                    // other quiz fields...
                    participated: 1,
                    completed:1,
                    createdBy: '$creator.username',
                    // include other fields as needed
                    title: 1,
                    description: 1,
                    schedule: 1,
                    published: 1,
                    totalQuestions:1,
                    thumbnail: 1,
                    timer:1,
                    createdAt: 1,
                }
            }
        ]);
        return res.status(200).json({success:true,data:quizess});
    } catch (error) {
        console.log(error);
        return res.status(500).json({err:'Unexpected Error'});
    }
}