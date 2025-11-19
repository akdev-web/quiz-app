
import React, { useEffect, useRef, useState } from 'react'
import { replace, useNavigate } from 'react-router-dom';
import IsoToLocalTimeString from '../../../components/util/IsotoLocal';
import ToastMsg from '../../../components/util/AlertToast';
import UserAvatar from '../../../components/util/UserAvatar';

const QuizCard = ({ quiz }) => {
    const { title, description, timer,createdBy,quizId,thumbnail,published,schedule,totalQuestions,participated,completed } = quiz;
    
    const navigate = useNavigate();
    // Utility function to trim by word count
    const trimmed = (text, limit) => {
        const words = text.trim().split(/\s+/);
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + " ...";
    }; 

    const [countdown,setCountdown] = useState(null)
    const [isVisible,setIsVisible] = useState(false)
    const cardRef = useRef()

    const now = Date.now();
    const scheduleTime = schedule ? new Date(schedule).getTime() : null;
    const showCountdown = scheduleTime && scheduleTime > now && ( (scheduleTime - now) <= 60*60*1000)

  
    // intersection Obesver to check card visiblity
    useEffect(()=>{
        if(!showCountdown) return;
        const observer = new window.IntersectionObserver(
            ([entery])=>setIsVisible(entery.isIntersecting),
            {threshold:0.1}
        );
        if(cardRef.current) observer.observe(cardRef.current);
        return () =>{
            if(cardRef.current) observer.unobserve(cardRef.current);
        }
    },[showCountdown])


    // setup countdown 
    useEffect(()=>{
        if(!showCountdown || !isVisible){
            setCountdown(null);
            return;
        }
        const updateCountdown = () =>{
            const diff = scheduleTime - Date.now();
            if(diff <= 0){
                setCountdown('Quiz is Live ');
            }
            else {
                const min = Math.floor(diff/ (60*1000))
                const sec = Math.floor(diff %   (60*1000) / 1000)
                setCountdown(`${min}m ${sec}s`);
            }
        }
        updateCountdown();
        const interval = setInterval(updateCountdown,1000);
        return () => clearInterval(interval);
    },[showCountdown,isVisible,scheduleTime])

    return (
        <div ref={cardRef} className="max-sm:max-w-[400px] max-sm:mx-auto flex flex-col rounded-xl shadow-lg bg-[var(---color-bg)] overflow-hidden transition hover:shadow-2xl hover:-translate-y-1 duration-200">
            <div className="w-full max-h-48 bg-[var(---color-bg-light)] overflow-hidden">
                <img
                    className="h-full w-full aspect-[2/3] object-cover"
                    src={thumbnail ? thumbnail.url :
                        `/quiz_thumbnails/thumbnail_${Math.floor(Math.random() * 4) + 1}.png`}
                    alt="Quiz Thumbnail"
                />
            </div>
            <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                    <UserAvatar name={createdBy.username} profile={createdBy.profile} size={24}/>
                    <p className="font-semibold text-sm text-[var(---color-text)]">{createdBy.username}</p>
                </div>
                <div className="cursor-pointer" 
                    onClick={() =>{
                        (!published && schedule) ?  
                        ToastMsg({
                            type:'err',
                            msg:showCountdown ? `Quiz will start in ${countdown}` : 
                            `Quiz Start At ${IsoToLocalTimeString(schedule)}` 
                        }) : 
                        completed ?  navigate(`/quiz/result/${quizId}`) :
                        navigate(`/quiz/participate/${quizId}`)
                    } }>
                    <h3 className="text-xl font-bold text-[var(---color-text)] mb-1 line-clamp-2">{trimmed(title, 10)}</h3>
                    <p className="text-sm text-[var(---color-text-light)] mb-2 line-clamp-3">{trimmed(description, 20)}</p>
                    <p className="text-sm text-[var(---color-text-light)] mb-2 line-clamp-3">No of Questions : {totalQuestions}</p>
                    {timer?.avail && (
                        <div className="text-xs text-[var(---color-text-xlight)]">
                            <span>Duration: {Math.floor(timer.duration / 60)} Minutes {timer.duration % 60} Seconds</span>
                        </div>
                    )}
                    {/* Countdown timer for scheduled quizzes within next hour and visible */}
                    {showCountdown && countdown ? 
                    (
                        <div className="mt-2 text-xs font-bold text-[var(---color-primary)] animate-pulse">
                            Starts in: {countdown}
                        </div>
                    )
                    :
                        (!published  && schedule ) &&  
                        <p className="text-xs text-[var(---color-text-xlight)]">Quiz Start At : {IsoToLocalTimeString(schedule)}</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default QuizCard