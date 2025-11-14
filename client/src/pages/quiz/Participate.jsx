import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../../components/api';
import ToastMsg from '../../components/util/AlertToast';
import GetTime from '../../components/util/DurationToTIme';

const Participate = () => {
    const quizId = useParams().id;
    if (!quizId) return <div>Not Found</div>;

    const state = useLocation().state;
    const loaded = useRef(false);
    if (state?.alert && !loaded.current) {
        ToastMsg(state.alert);
        loaded.current = true;
    }
    const navigate = useNavigate();

    const initial = {
        isLoading: true,
        quizDetails: null,
    }
    const reducer = (state, field) => {
        switch (field.type) {
            case 'load':
                return { ...state, isLoading: field.value };
            case 'detail':
                return { ...state, quizDetails: field.value };
            default:
                return state;
        }
    }
    const [{ isLoading, quizDetails }, setQuiz] = useReducer(reducer, initial)
    const [fadeTransition, setFadeTransition] = useState(true);
    const [nextloading,setNextLoading] = useState(false);

    const [iscompleted, setCompleted] = useState(false);
    const [question, setQuestion] = useState(null);
    const setupCurrent = (current, state) => {
        switch (state.type) {
            case 'proc':
                return { ...current, processing: state.value }
            case 'setq':
                return { ...current, current_q: state.value }
            case 'set':
                return { ...current, [state.id]: state.value }
            default:
                return current;
        }
    }
    const current = { processing: true, qNo: null, qes: null, ans: null };
    const [{ processing, qNo, qes, ans }, setCurrent] = useReducer(setupCurrent, current);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(null);
    const timerRef = useRef();


     // Timer countdown effect
    useEffect(() => {
        if (!quizDetails?.timer?.avail || !quizDetails?.timer?.duration) return;
        if (iscompleted) return;
        if (timeLeft === null) return;

        timerRef.current && clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev > 1) return prev - 1;
                clearInterval(timerRef.current);

                getProgress() // make progress api request to update progess and timeout
                return 0;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [quizDetails?.timer?.avail, quizDetails?.timer?.duration, iscompleted, timeLeft]);


    useEffect(() => {
        const getQuiz = async () => {
            setQuiz({ type: 'load', value: true });
            try {
                const res = await api.get(`/quiz/${quizId}`);
                if (res.data.success) {
                    let data = res.data;
                    setQuiz({ type: 'detail', value: data.quiz });
                    setQuiz({ type: 'load', value: false });
                }


            } catch (error) {
                setQuiz({ type: 'load', value: false });
                console.log(error);

            }
        }
        getQuiz();
    }, [quizId])


    async function getProgress() { // get progress if user already participated or now participating
        setCurrent({ type: 'proc', value: true })
        try {
            const progress = await api.get(`quiz/progress/${quizId}`);
            if (progress.data.success) {
                const data = progress.data;
                if (data.completed) {
                    setCompleted(true);
                    navigate(`/quiz/result/${quizId}`, {});
                    return;
                }
                if(data.timeout && !isNaN(new Date(data.timeout).getTime())){
                    const timeLeft = Math.floor(Math.max(0,new Date(data.timeout).getTime() - Date.now()) / 1000 );
                    setTimeLeft(timeLeft);
                }
                setCurrent({ type: 'set', id: 'qNo', value: data.qIndex });
                setCurrent({ type: 'set', id: 'qes', value: data.current });
                setCurrent({ type: 'proc', value: false })
            }
        } catch (error) {
            setCurrent({ type: 'proc', value: false })
            console.log(error);
        }
    }

    useEffect(() => { getProgress(); }, [])


    const getQuestion = () => { // get Question Data 
        if (qes == null) return;

        setFadeTransition(false);
        setNextLoading(true)
        setTimeout(async() => {
            
            try {
                const res = await api.get(`/quiz/${quizId}/${qes}`)

                if (res.data.success) {
                    setNextLoading(false)
                    setQuestion(res.data.data);
                    setCurrent({ type: 'set', id: 'ans', value: null })
                    setCurrent({ type: 'proc', value: false })
                    setFadeTransition(true);
                }
            } catch (error) {
                setNextLoading(false)
                setCurrent({ type: 'proc', value: false })
                setFadeTransition(true);
                console.log(error);
            }
        }, 300);
    }

    useEffect(() => { getQuestion() }, [qes]);

    const submitAnswer = async (ans) => { // submit each quesion's answer 
        setCurrent({ type: 'set', id: 'ans', value: ans })
        setCurrent({ type: 'proc', value: true })
        try {
            const res = await api.post(`submit_quiz/ans/${quizId}/${qes}`, { question, ans });
            if (res.data.success) {
                const data = res.data;
                if (data.completed) {
                    setCompleted(true);
                    // navigate ot result 
                    navigate(`/quiz/result/${quizId}`, {});
                } else {
                    setCurrent({ type: 'set', id: 'qNo', value: data.qIndex });
                    setCurrent({ type: 'set', id: 'qes', value: data.current });
                }
                setCurrent({ type: 'proc', value: false })
            }
        } catch (error) {
            setCurrent({ type: 'proc', value: false })
            console.log(error);
        }
    }

    if (isLoading) return <div className='mt-10 w-12 h-12 border-4 border-gray-300 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mx-auto'></div>;
    return (
        <div className='sm:max-w-[800px] mx-auto'>
            {
                quizDetails &&
                <div className='w-full flex flex-col justify-end rounded-md  bg-[var(---color-bg)] px-4 py-6'>
                    <h2 className='w-full text-center text-3xl font-bold'>{quizDetails.title}</h2>
                    <span className='text-md text-right text-[var(---color-text-xlight)]'> 
                        <span>Time Duration : </span> 
                        <GetTime duration={quizDetails.timer.duration} sec={true} />
                    </span>
                    {quizDetails.timer?.avail && (
                        <div className="mt-2 text-center">
                            <span className="font-semibold text-lg text-[var(---color-text-light)]">
                                Time Left: <GetTime duration={timeLeft} sec={true} />
                            </span>
                        </div>
                    )}
                </div>
            }
            <div className='mt-10 w-full flex flex-col justify-start rounded-md  bg-[var(---color-bg)] px-4 py-6'>
                {
                    iscompleted ?
                        <div>Redirecting to Result ...</div>
                        :
                        nextloading ?
                            <>
                                <div className='mt-10 w-12 h-12 border-4 border-gray-300 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mx-auto'></div>
                                <p className='text-center text-sm text-[var(---color-text-light)]'>Fetching next ....</p>
                            </>
                            :
                            (question &&
                                <>
                                    <div className={`flex items-center justify-between font-medium ${fadeTransition ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                                        <h3 className='text-xl text-[var(---color-text-light)]'>Question: {qNo} of {quizDetails.totalQuestions} </h3>
                                        {/* <span className='text-md text-right text-[var(---color-text-xlight)]'> 00:40</span> */}
                                    </div>
                                    <h3 className='mt-5 text-lg text-center font-semibold'>{question.quest}</h3>
                                    <div className={`relative mt-5 text-center flex flex-col gap-3 `}>
                                        {
                                            question.options?.map((opt) => {
                                                return (
                                                    <div onClick={() => {!processing && submitAnswer(opt.id)}} key={opt.id} className={`px-1 py-2 text-md border-2 rounded-sm  hover:border-[var(--border-hover)] 
                                                        transition-colors duration-300 cursor-pointer  ${processing && 'opacity-10'}
                                                        ${ans === opt.id ? 'border-[var(--border-selected)]' : 'border-[var(--border-default)]'}`}>
                                                        <p>{opt.option}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                        { processing &&
                                            <div className='absolute top-0 left-0 w-full h-full '>
                                                <div className='mt-10 w-12 h-12 border-4 border-gray-300 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mx-auto'></div>
                                                <p className='text-sm text-[var(---color-text-light)]'>Saving Response ...</p>
                                            </div> 
                                        }  
                                    </div>
                                </>)
                }
            </div>
        </div>
    )
}

export default Participate