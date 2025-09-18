import { FilePen, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GetTime from '../../../components/util/DurationToTIme';
import { useRef, useState } from 'react';
import api from '../../../components/api';

const QuizCardDash = ({ quiz, totalParticipants, topParticipants, edit, deleteQuiz,refreshQuizDashboard }) => {
    const { title, description, timer, category, quizId, createdBy,thumbnail } = quiz;

    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

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
        <div className='rounded-xl shadow-lg bg-[var(---color-bg)] overflow-hidden transition hover:shadow-2xl hover:-translate-y-1 duration-200'>
            <div className='flex flex-col md:flex-row gap-0 md:gap-4'>
                <div className="w-full md:w-1/3 flex items-center justify-center bg-[var(---color-bg-light)]">
                    <img
                        src={ thumbnail ? thumbnail.url :
                            `/quiz_thumbnails/thumbnail_${thumbIndexRef.current}.png`}
                        alt="Quiz Thumbnail"
                        className="w-full h-44 md:h-72 object-cover rounded-xl"
                    />
                </div>
                <div className='w-full md:w-2/3 p-4 flex flex-col justify-between'>
                    {
                        <div className='user font-semibold '>
                            <p>{createdBy.username}</p>
                        </div>
                    }
                    <div className="details cursor-pointer" onClick={() => navigate(`/quiz/participate/${quizId}`)} >
                        <h3 className='text-xl font-bold text-[var(---color-text)] mb-1 line-clamp-2'>{trimmed(title, 10)}</h3>
                        <p className='text-sm text-[var(---color-text-light)] mb-2 line-clamp-3'>{trimmed(description, 20)}</p>
                        <div className='text-xs text-[var(---color-text-xlight)]'>
                            {
                                timer?.duration ? (
                                    <span>Duration: {Math.floor(timer.duration / 60)} Minutes {timer.duration % 60} Seconds</span>
                                ) : ''
                            }
                        </div>
                    </div>
                    <div className='flex gap-3 mt-3'>
                        <button type="button" className="p-2 rounded-lg bg-[var(---color-bg-light)] text-[var(---color-text)] hover:bg-[var(---color-bg)] hover:shadow cursor-pointer flex items-center gap-1"
                            onClick={() => { edit(quiz) }}>
                            <FilePen size={22} /> Edit
                        </button>
                        <button type="button" className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 hover:shadow cursor-pointer flex items-center gap-1"
                            onClick={() => handleDeleteQuiz(quizId)} disabled={deleting}>
                            <Trash size={22} /> {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
            <div className='mt-4'>
                <button type='button' className='p-2 rounded-lg bg-[var(---color-bg-light)] text-[var(---color-text)] font-semibold w-full hover:bg-[var(---color-bg)] hover:shadow cursor-pointer'
                    onClick={() => navigate(`/quiz/create/${quizId}`, { replace: true, state: quiz })}>
                    Update Questions
                </button>
            </div>
            {
                topParticipants ?
                    <div className='p-4 font-mono'>
                        <p className='text-lg text-center font-semibold '>
                            Total Participated User :  <span>{totalParticipants}</span>
                        </p>
                        <table className="mt-4 w-full border border-[var(---border-default)] text-sm text-left">
                            <thead className="bg-gray-100">
                                <tr className='px-4 py-2 text-lg text-center font-semibold my-4'>
                                    <th colSpan={3} className='text-gray-700'>Top 3 Participants</th>
                                </tr>
                                <tr>
                                    <th className="border border-[var(---border-default)] px-4 py-2 font-semibold text-gray-700">User Name</th>
                                    <th className="border border-[var(---border-default)] px-4 py-2 font-semibold text-gray-700">Correct Ans.</th>
                                    <th className="border border-[var(---border-default)] px-4 py-2 font-semibold text-gray-700">Time Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topParticipants.map((p, idx) => (
                                    <tr key={idx} className=" ">
                                        <td className="border border-[var(---border-default)] px-4 py-2">{p.username}</td>
                                        <td className="border border-[var(---border-default)] px-4 py-2">{p.correctCount}</td>
                                        <td className="border border-[var(---border-default)] px-4 py-2">{GetTime({ duration: p.timespent })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> :
                    <div className='p-4 font-mono text-center text-lg'>
                        <p>No One Participated in this quiz</p>
                    </div>
            }
            {
                topParticipants && 
                <div className='p-4 text-center text-sm text-[var(---color-text-xlight)] cursor-pointer hover:underline'
                    onClick={() => navigate(`/dashboard/${quizId}`)} >
                    view Full Rank List
                </div>
            }
        </div>
    )
}

export default QuizCardDash