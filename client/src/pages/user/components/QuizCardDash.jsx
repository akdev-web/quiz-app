import { ChartNoAxesColumn, ChartNoAxesColumnIncreasing, FilePen, Trash, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GetTime from '../../../components/util/DurationToTIme';
import { useRef, useState } from 'react';
import api from '../../../components/api';
import { BiSolidEditAlt } from "react-icons/bi";

const QuizCardDash = ({ quiz, totalParticipants, topParticipants, edit, deleteQuiz, refreshQuizDashboard }) => {
    const { title, description, timer, category, quizId, createdBy, thumbnail } = quiz;

    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);
    const [showTop3,setshowTop3] = useState(false)

    // Utility function to trim by word count
    const trimmed = (text, limit) => {
        const words = text.trim().split(/\s+/);
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + " ...";
    };

    const thumbIndexRef = useRef(Math.floor(Math.random() * 4) + 1);

    const handleDeleteQuiz = async (quizId) => {
        if (!window.confirm('Are you sure you want to delete this quiz and all its data?')) return;
        setDeleting(true);
        try {
            await api.delete(`quiz/${quizId}/remove`);
            // Optionally, trigger a refresh or remove the quiz from UI here
            if (typeof deleteQuiz === 'function') deleteQuiz(quizId);
            refreshQuizDashboard();
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.err || 'Failed to delete quiz');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="relative rounded-xl max-md:max-w-[400px] max-md:mx-auto  shadow-lg bg-[var(---color-bg)] overflow-hidden transition-transform duration-200 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
            {/* Image Section */}
            <div className="w-full  flex items-center justify-center bg-[var(---color-bg-light)] overflow-hidden">
                <img
                    src={thumbnail ? thumbnail.url : `/quiz_thumbnails/thumbnail_${thumbIndexRef.current}.png`}
                    alt="Quiz Thumbnail"
                    className="w-full aspect-[2/1] object-cover "
                />
            </div>

            {/* Details Section */}
            <div className="w-full p-4 flex flex-col flex-1 justify-between">

                {/* Creator */}
                <div className="user font-semibold text-sm text-[var(---color-text-light)] mb-2">
                    {createdBy.username}
                </div>

                {/* Quiz Info */}
                <div className="details mb-3" >
                    <h3 className="text-lg md:text-xl font-bold text-[var(---color-text)] mb-1 line-clamp-2">{trimmed(title, 10)}</h3>
                    <p className="text-sm md:text-base text-[var(---color-text-light)] mb-2 line-clamp-3">{trimmed(description, 20)}</p>
                    {timer?.duration && (
                        <div className="text-xs md:text-sm text-[var(---color-text-xlight)]">
                            Duration: {Math.floor(timer.duration / 60)} Min {timer.duration % 60} Sec
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-3  justify-around">
                    <button
                        type="button"
                        className="cursor-pointer flex items-center gap-2 justify-center p-2 rounded-lg bg-[var(---color-bg-light)] text-[var(---color-text)] font-semibold hover:bg-[var(---color-bg)] hover:shadow transition"
                        onClick={() => edit(quiz)}
                    >
                        <FilePen size={20} /> <p>Quiz</p>
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer flex gap-2 items-center justify-center  p-2 rounded-lg bg-[var(---color-bg-light)] text-[var(---color-text)] font-semibold hover:bg-[var(---color-bg)] hover:shadow transition"
                        onClick={() => navigate(`/quiz/create/${quizId}`, { replace: true, state: quiz })}
                    >
                        <BiSolidEditAlt size={20} /><p>Questions</p>
                    </button>

                    <button
                        type="button"
                        className="flex items-center gap-2 justify-center p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 hover:shadow transition"
                        onClick={() => handleDeleteQuiz(quizId)}
                        disabled={deleting}
                    >
                        <Trash size={20} /> {deleting ? "Deleting..." : "Delete"}
                    </button>
                    
                </div>
            </div>




            {/* Participants Table */}
            {(topParticipants && showTop3) &&(
                <div className="p-4 font-mono overflow-x-auto absolute w-full h-full bg-[var(---color-bg)]">
                    <div className='flex justify-between items-center'>
                        <p className="text-lg text-center font-semibold ">
                            Total Participated Users: <span>{totalParticipants}</span>
                        </p>
                        <button type='button' className='cursor-pointer rounded-md p-1 bg-[var(--color-qbtn-bg)] hover:bg-[var(--color-qbtn-hover-bg)] transition-colors duration-150'
                            onClick={()=>setshowTop3(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <table className="mt-3 w-full min-w-[300px] border border-[var(---border-default)] text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr className="text-center text-lg font-semibold">
                                <th colSpan={3} className="text-gray-700 py-2">Top 3 Participants</th>
                            </tr>
                            <tr>
                                <th className="border border-[var(---border-default)] px-2 py-1 font-semibold text-gray-700">User Name</th>
                                <th className="border border-[var(---border-default)] px-2 py-1 font-semibold text-gray-700">Correct Ans.</th>
                                <th className="border border-[var(---border-default)] px-2 py-1 font-semibold text-gray-700">Time Spent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topParticipants.map((p, idx) => (
                                <tr key={idx}>
                                    <td className="border border-[var(---border-default)] px-2 py-1">{p.username}</td>
                                    <td className="border border-[var(---border-default)] px-2 py-1">{p.correctCount}</td>
                                    <td className="border border-[var(---border-default)] px-2 py-1">{GetTime({ duration: p.timespent })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) }

            {/* Full Rank List label */}
            {topParticipants ? (
                <div className='flex gap-2.5 mb-2.5 p-2'>
                    <button className='flex gap-1 items-end justify-center text-sm font-semibold  hover:bg-[var(--color-qbtn-hover-bg)] bg-[var(--color-qbtn-bg)]  flex-1 p-2 rounded-md  text-[var(---color-text-light)] transition-colors duration-150' type='button'
                        onClick={()=>setshowTop3(true)}
                        >
                        <ChartNoAxesColumn size={28} />
                        Top 3 list
                    </button>
                    <div
                        className="flex gap-1 items-end justify-center text-sm font-semibold hover:bg-[var(--color-qbtn-hover-bg)] bg-[var(--color-qbtn-bg)]  flex-1 p-2 rounded-md text-center text-[var(---color-text-light)] cursor-pointer transition-colors duration-150"
                        onClick={() => navigate(`/dashboard/${quizId}`)}
                    >   
                    <ChartNoAxesColumnIncreasing size={28} />
                        View Full Rank List
                    </div>
                </div>
                
            ) 
            : (
                <div className="p-4 font-mono text-center text-md text-[var(---color-text-light)] border-t-2 border-t-gray-200 dark:border-t-[#776c6c2b] ">
                    <p>No participants yet !</p>
                </div>
            )}

        </div>
    )
}

export default QuizCardDash