import cloudinary from '../../config/cloudinary.js';
import connectDB from '../../config/conn.js'
import Quiz from '../../models/quiz.js'
export default async function updateQuiz(req, res) {
    const {title, description, duration, category, publish, schedule,thumbnail } = req.body;

    const Id  = req.quiz._id;
    try {

        const quiz = await Quiz.findById(Id);

        if (quiz) {
            quiz.title = title;
            quiz.description = description;
            quiz.timer = duration && !isNaN(parseInt(duration)) && parseInt(duration) > 0 ? { avail: true, duration: parseInt(duration) } 
                                                                                            : { avail: false, duration: 0 };
            quiz.category = category;

            if(thumbnail){
                // delete old image from cloudinary
                if(quiz.thumbnail.cloudId){
                    cloudinary.uploader.destroy(quiz.thumbnail.cloudId, (err, result) => {
                        if (err){ 
                            console.error('cloud image updating error :', err);
                            return res.status(500).json({ err: 'cloud image updating error' });
                        }
                    })
                }

                quiz.thumbnail = thumbnail; // save new thumbnail
            }


            const nowTime = new Date();
            switch(publish){
                case 'now' :
                    quiz.schedule = nowTime;
                    quiz.published = true;
                    break;
                case 'schedule' :
                    const scheduleTime = new Date(schedule);

                    if(isNaN(scheduleTime.getTime()) || scheduleTime < nowTime){
                        quiz.schedule = nowTime; // if not a valid time
                        quiz.published = true; // publish immediately
                    } else {
                        quiz.schedule = scheduleTime; // set to valid future time
                        quiz.published = false; // will be published later
                    }
                    break;
                default : // case 'private' :
                    quiz.schedule = null;
                    quiz.published = false;
            }


            await quiz.save();
            return res.status(200).json({ success: true, msg: 'Quiz Updated Successfully', data: quiz });
        } else {
            return res.status(404).json({ err: 'Request not Responded or invalid !' });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: 'Unexpected Error' });
    }
}