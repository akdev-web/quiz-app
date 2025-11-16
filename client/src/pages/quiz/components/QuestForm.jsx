import React, { forwardRef, useEffect, useImperativeHandle, useReducer, useRef, useState } from 'react'
import api from '../../../components/api'
import { useNavigate, useParams } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5';
import QuestionParser from './QuestionParser';

const QuestForm = forwardRef(({quizDetails,quiz,setQuiz,edit,setEdit},ref) => {
    const navigate = useNavigate()
    const questionParserRef = useRef();
    const quiz_id = useParams().id;
    const questFormRef = useRef(null)

    // useImperativeHandle(ref,()=>{
    //     focus: questFormRef.
    // })

    useEffect(()=>{
        if(!quiz_id) return;

        const getQuestions = async() =>{
            try {
                const res = await api.get(`/quiz/${quiz_id}`);
                if(res.data.success){
                    let data = res.data;
                    if(data.data.length >0){
                        setQuiz(data.data);
                    }
                    else{
                        manager({field:'msg',value:{msg:'This Quiz is Empty ! Insert Questions ...'}})
                    }
                }
            } catch (error) {
                let res = error.response?.data;
                manager({field:'msg',value:{type:'err',msg:res.err}});
            }
        }
        getQuestions();         
    },[quiz_id])

    useEffect(()=>{
        const setEditor = (id) => {
            const toEdit = quiz.filter((v, i) => v.id === id)[0];
            if (toEdit) {
                setQuestion(toEdit.quest)
                setAnswer(toEdit.ans)
                setNofOptions(toEdit.options.length)
                setOptions(toEdit.options)
            }
        }
        setEditor(edit);
    },[edit])

    const initialSate = {
        createNew: false,
        message: null
    }
    const manageFunc = (state, action) => {
        switch (action.field) {
            case 'create':
                return { ...state, createNew: action.value };
            case 'msg':
                return { ...state, message: action.value };
            default:
                return state;
        }

    }

    const [manage, manager] = useReducer(manageFunc, initialSate)
    const [noOfoptions, setNofOptions] = useState(0);
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState([]);
    const [answer, setAnswer] = useState(0);


    const resetQuetionEditor = () => {
        setQuestion('')
        setAnswer(0)
        setNofOptions(0);
        setOptions([]);
        questionParserRef.current.reset();
    }

    const validateQuestion = () => {
        manager({ field: 'msg', value: null });
        if (question === '' || question.length < 10) {
            manager({ field: 'msg', value: { type: 'err', msg: 'question is too short or empty !' } })
            return false;
        }

        let isOptionEmpty = false;
        if (options.length <= 0) {
            isOptionEmpty = true;
        }
        else {
            options.forEach(option => {
                if (!option.option || option.option === '') {
                    isOptionEmpty = true;
                    return false;
                }
            });
        }

        if (isOptionEmpty) {
            manager({ field: 'msg', value: { type: 'err', msg: 'Options are empty !' } })
            return false;
        }

        if (!answer || answer === 0) {
            manager({ field: 'msg', value: { type: 'err', msg: 'Please select the correct option !' } })
            return false;
        }

        return true;
    }

    const showOptionsEditor = (e) => {
        const count = parseInt(e.target.value);
        if (!count || isNaN(count)) {
            console.log('Please select valid Option !');
            setOptions([]);
            return;
        }

        setNofOptions(count);
        const havingOptions = options.length > 0;
        setOptions(Array.from({ length: count },
            (v, k) => (
                {
                    id: k + 1,
                    ans: false,
                    option: havingOptions ? (options[k]?.option) : '',
                }
            )
        ))

    }

    const handleOptionChange = (i, v) => {
        const newOptions = [...options];
        newOptions[i].option = v;

        setOptions(newOptions);
    }

    const handleAddMore = () => {
        if (!validateQuestion()) {
            return;
        }
        const newId = quiz.length > 0 ? quiz[quiz.length-1].id+1 : 1;
        const new_quiz = { id: newId, quest: question, options: options, ans: answer };
        setQuiz(prev => [...prev, new_quiz]);

        resetQuetionEditor();
        manager({ field: 'msg', value: { type: 'ok', msg: 'Question Added . Add New ...' } })
    }


    

    const updateQuiz = () => {
        if (!validateQuestion()) return;
        let new_quiz = [...quiz];
        new_quiz = new_quiz.filter((v, i) => {
            if (v.id == edit) {
                v.quest = question;
                v.options = options;
                v.ans = answer;
            }
            return v;
        })
        console.log(new_quiz);
        setEdit(0);
        resetQuetionEditor();
    }

    const handleDone = async () => {
        if (!quizDetails.quizId) return;
        manager({ field: 'msg', value: { type: 'ok', msg: 'Please wait while Saving ..'} });

        let currentQuiz = [...quiz];
        if (validateQuestion()) {
            const newId = quiz.length > 0 ? quiz[quiz.length-1].id+1 : 1;
            const new_quiz = { id: newId, quest: question, options: options, ans: answer };
            currentQuiz = [...quiz, new_quiz];
        }

        const { quizId } = quizDetails;
        try {
            const res = await api.post('/quiz/add', { quizId, quiz:currentQuiz });
            if (res.data.success) {
                const data = res.data;
                manager({ field: 'msg', value: { type: 'ok', msg: data.msg } });
            }
        } catch (error) {
            const res = error.response?.data;
            manager({ field: 'msg', value: { type: 'err', msg: res.err || 'Server Error' } });
        }
    }

    return (
        <div className='w-full px-4 py-8 max-w-[800px] mx-auto bg-[var(---color-bg)] rounded-lg shadow-md shadow-gray-300 dark:shadow-black'>
            <div className=' flex gap-4 items-center'>
                <div onClick={()=>navigate('/quiz')}>
                    <IoArrowBack size={28} />
                </div>
                <div className=' w-full '>
                    <h3 className='text-2xl font-bold'>{quizDetails.title}</h3>
                    <p className='text-md text-[var(---colo-text-light)]'>{quizDetails.description}</p>
                </div>
            </div>
            <div className='my-2 border-b-4 border-[var(---color-border)]'></div>

            <>
                {
                    (edit && edit != 0) ?
                        <h2 className='text-2xl text-[var(---color-text)]'>{`Updating Question ${edit}`}</h2>
                        :
                        <h2 className='text-2xl text-[var(---color-text)]'>{`Question ${quiz.length + 1}`}</h2>
                }

                <div className='mt-5 flex flex-col gap-4'>
                    {manage.message &&
                        (
                            manage.message.type === 'err' ?
                                <p className='my-2 px-2 py-1 text-sm text-[var(--color-error-text)] bg-[var(--color-error-bg)]'>{manage.message.msg}</p>
                                :
                                <p className='my-2 px-2 py-1 text-sm text-[var(--color-success-text)] bg-[var(--color-success-bg)]'>{manage.message.msg}</p>
                        )
                    }
                    <QuestionParser 
                        ref={questionParserRef}
                        onUpdate={(form)=>{
                            setQuestion(form.question); 
                            setOptions(form.options.map((v,i)=>({
                                id:i+1,
                                ans: (i+1 === form.answer) ,
                                option:v
                            }))); 
                            setAnswer(form.answer); 
                            setNofOptions(form.options.length);}} 
                        
                    />



                    <input className='px-2 py-1 rounded-md border-2 border-[var(---color-input-border)] focus:outline-0 focus:border-[var(---color-input-b-focus)]'
                        type="text" name="quest" placeholder='Enter you Question Here' value={question} onChange={(e) => setQuestion(e.target.value)} />
                    <div className='flex  justify-between not-last:'>
                        <label htmlFor="" className='flex-1 font-medium'>Select No. of Options : </label>
                        <select value={noOfoptions} className='flex-1 text-center focus:outline-0' name="options" id="" onChange={showOptionsEditor}>
                            <option className='bg-[var(---color-bg)]' value="0">--- Select---</option>
                            {
                                [3, 4, 5].map((v, i) => {
                                    return <option className='bg-[var(---color-bg)]' key={i} value={v}>{v}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="ans-opts border-2 border-gray-100 dark:border-[#f6f3f41f] rounded-lg p-2">
                        {
                            options.length === 0 ?
                                <p className='text-center text-[var(---colo-text-light)] text-sm'>-- No Options --- </p>
                                :
                                <>
                                    <h3 className='text-center font-medium'>Options </h3>
                                    <span className='text-sm text-[var(---color-text-light)]'>Note : Tick the correct answer</span>
                                    {options.map((v, i) => {
                                        return <div key={i} className='px-4 py-1 border-2 border-[var(---color-input-border)]  mt-2 flex gap-2.5 justify-start'>
                                            <input type="radio" key={`ans${v.id}`} name='answer' checked={v.id == answer} value={answer} onChange={(e) => setAnswer(v.id)} />
                                            <input className='flex-1 outline-0 focus:outline-0'
                                                key={i} type="text" name={`option${v.id}`} placeholder={`Option ${v.id}`}
                                                value={v.option} onChange={(e) => handleOptionChange(i, e.target.value)} />
                                        </div>
                                    })
                                    }
                                </>
                        }
                    </div>
                    {
                        (edit || edit != 0) ?
                            <button type="button" className='cursor-pointer px-4 py-2 flex gap-2 justify-center items-center rounded-full bg-black text-white'
                                onClick={updateQuiz}>
                                Update
                            </button>
                            :
                            <button type="button" className='cursor-pointer px-4 py-2 flex gap-2 justify-center items-center rounded-full bg-black text-white'
                                onClick={handleAddMore}>
                                Add More
                            </button>
                    }
                    <button type="button" className='cursor-pointer px-4 py-2 flex gap-2 justify-center items-center rounded-full bg-black text-white 
                    disabled:bg-gray-800 disabled:cursor-not-allowed'
                        disabled={edit || edit != 0}
                        onClick={handleDone}>
                        Save
                    </button>
                </div>
            </>

        </div>
    )
})

export default QuestForm