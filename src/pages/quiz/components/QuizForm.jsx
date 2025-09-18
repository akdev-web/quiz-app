import React, { useEffect } from 'react'
import { useState, useReducer } from 'react'
import { IoMdAdd } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import { RiResetLeftFill } from 'react-icons/ri';
import PublishInput from './PublishInput';
import api from '../../../components/api';
import { useNavigate } from 'react-router-dom';

const QuizForm = ({ manage, manager, edit,setEdit }) => {

    const navigate = useNavigate();
    const initQuiz = {
        title: '',
        description: '',
        category: '',
        timer: { avail: false, duration: 0 },
        schedule: false,
    }

    
    const [thumbnailFile, setThumbnailFile] = useState(null);

    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [publishNow,setPublishNow] = useState('private' );
    const [showUpdateAlert, setShowUpdateAlert] = useState(false);

    const quizManager = (state, field) => {
        switch (field.type) {
            case 'set':
                return { ...state, [field.name]: field.value };
            case 'reset':
                return initQuiz;
            default:
                return state;
        }
    }


    const setFields = (e) => {
        setQuizDetails({ type: 'set', name: e.target.name, value: e.target.value });
    }
    const [quizDetails, setQuizDetails] = useReducer(quizManager, initQuiz);
    const [isCustomTime, setIsCustomTIme] = useState(false);
    const [customTime, setCustomTime] = useState({ min: 0, sec: 0 });



    const ResetQuiz = () => {
        setQuizDetails({ type: 'reset' });
        setIsCustomTIme(false);
        setCustomTime({ min: 0, sec: 0 })
    }

    useEffect(() => {
        if (!edit) return;
        manager({field:'create',value:true})
        setPublishNow(edit.published ? 'schedule' : 'private')
        for (const [k, v] of Object.entries(edit)) {
            setQuizDetails({ type: 'set', name: k, value: v });
        }
        if (edit.thumbnail?.url) {
            setThumbnailPreview(edit.thumbnail.url);
        }
    }, [edit]);
    // Handle thumbnail input change
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove thumbnail
    const handleRemoveThumbnail = () => {
        setThumbnailFile(null);
        setThumbnailPreview('');
    };


    const quizValidator = () => {
        if (quizDetails.title.length < 10) {
            manager({ field: 'msg', value: { type: 'err', msg: 'Tittle is too short or empty !' } });
            return false;
        } else if (quizDetails.description < 10) {
            manager({ field: 'msg', value: { type: 'err', msg: 'Description is too short or empty !' } });
            return false;
        } else if (quizDetails.timer.avail) {
            if (0 < quizDetails.timer.duration > 3600) {
                manager({ field: 'msg', value: { type: 'err', msg: 'Quiz duration is invalid or exceed max limit !' } });
                return false;
            }
        }
        return true;
    }

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        manager({field:'msg',value:null})
        if (quizValidator()) {
            try {
                manager({ field: 'msg', value: { type: 'ok', msg: 'creating  ....' } })
                // Prepare FormData for file upload
                const formData = new FormData();
                formData.append("title", quizDetails.title);
                formData.append("description", quizDetails.description);
                formData.append("duration", quizDetails.timer.duration);
                formData.append("category", quizDetails.category);
                // don't publish
                if (thumbnailFile) {
                    formData.append("thumbnail", thumbnailFile);
                }
                // Send FormData to backend using axios instance
                const res = await api.post("quiz/new", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const data = res.data;
                if (!data.success) throw new Error(data.message || "Failed to create quiz");
                navigate('/quiz/create', { replace: true, state: res.data.data, alert:{ type: 'ok', msg: data.msg } });

            } catch (error) {
                console.log(error);
                let err = error.message || error.response?.data;
                manager({ field: 'msg', value: { type: 'err', msg: err.err || 'Server Error' } });
            }
        }
    }

    const handleUpdateQuiz = async (e) => {
        e.preventDefault();
        manager({field:'msg',value:null})
        if (!showUpdateAlert) {
            // Show alert box before proceeding
            const confirmUpdate = window.confirm(
                'Warning: If you update this quiz, all participated users and their answers will be deleted. Do you want to continue?'
            );
            if (!confirmUpdate) return;
            setShowUpdateAlert(true);
        }
        if(quizValidator()){
            try {
                manager({field:'msg',value:{type:'ok',msg:'updating  ....'}})
                // Prepare FormData for file upload
                const formData = new FormData();
                formData.append("title", quizDetails.title);
                formData.append("description", quizDetails.description);
                formData.append("duration", quizDetails.timer.duration);
                formData.append("category", quizDetails.category);
                formData.append("publish", publishNow);
                formData.append('schedule',quizDetails.schedule);
                if (thumbnailFile) {
                    formData.append("thumbnail", thumbnailFile);
                }
                // Send FormData to backend using axios instance
                const response = await api.put(`quiz/update/${edit.quizId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                const data = response.data;
                if (!data.success) throw new Error(data.message || "Failed to update quiz");
                manager({field:'msg',value:{type:'ok',msg:data.msg}});
                setEdit(data.data);
            } catch (error) {
                console.log(error);
                const err = error.response?.data;
                manager({field:'msg',value:{type:'err',msg:err.err || 'Server Error'}});
                console.log(error);
            }
        }
    }

    return (
        <form className='w-full px-4 py-8 max-w-[800px] mx-auto bg-[var(---color-bg)] rounded-lg shadow-md shadow-gray-300 dark:shadow-black'
            onSubmit={ edit ? handleUpdateQuiz : handleCreateQuiz }>
            <div className=' w-full   flex gap-2.5 items-center justify-between'>
                {edit ?
                    <>
                        <h3 className='text-2xl font-bold'>Updating Quiz</h3>
                    </> :
                    <h3 className='text-2xl font-bold'>Create A Quiz</h3>}
                {!manage.createNew ?
                    <button type="button" className=' px-4 py-2 flex gap-2 justify-center items-center rounded-full bg-black text-white'
                        onClick={() => {
                            manager({ field: 'create', value: true })
                        }}>
                        <IoMdAdd size={24} color='white' />
                        {edit ? 'Update' : 'Create'}
                    </button>
                    :
                    (
                        <button type="button" className=' px-4 py-2 flex gap-2 justify-center items-center rounded-full bg-black text-white'
                            onClick={() => {
                                manager({ field: 'create', value: false })
                                ResetQuiz();
                                setEdit && setEdit(null); 
                            } }>
                            <MdClose size={24} color='white' />
                            Cancel
                        </button>

                    )
                }
            </div>
            <div className='my-2 border-b-4 border-[var(---color-border)]'></div>
            {manage.createNew &&
                <>

                    <div className='mt-5 flex flex-col gap-4'>
                        {manage.message &&
                            (
                                manage.message.type === 'err' ?
                                    <p className='my-2 px-2 py-1 text-sm text-[var(--color-error-text)] bg-[var(--color-error-bg)]'>{manage.message.msg}</p>
                                    :
                                    <p className='my-2 px-2 py-1 text-sm text-[var(--color-success-text)] bg-[var(--color-success-bg)]'>{manage.message.msg}</p>
                            )
                        }


                        {/* Thumbnail input and preview */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-[var(---color-text)]">Quiz Thumbnail</label>
                            <div className="flex items-center gap-3">
                                <label htmlFor="thumbnail-upload" className="inline-block px-4 py-2 rounded-full bg-[var(---color-bg-light)] text-[var(---color-text)] font-semibold cursor-pointer border border-[var(---color-input-border)] hover:bg-[var(---color-bg)] transition">
                                    {thumbnailPreview ? 'Change Thumbnail' : 'Choose Thumbnail'}
                                </label>
                                <input
                                    id="thumbnail-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    disabled={!manage.createNew}
                                    className="hidden"
                                />
                                {thumbnailPreview && (
                                    <button type="button" onClick={handleRemoveThumbnail} className="ml-2 text-red-500 hover:text-red-700 text-xl font-bold rounded-full bg-white border border-gray-300 w-8 h-8 flex items-center justify-center shadow">
                                        &times;
                                    </button>
                                )}
                            </div>
                            {thumbnailPreview && (
                                <div className="mt-2 flex justify-center">
                                    <img src={thumbnailPreview} alt="Thumbnail Preview" className="max-h-40 rounded-lg shadow" />
                                </div>
                            )}
                        </div>

                        <input className='px-2 py-1 rounded-md border-2 border-[var(---color-input-border)] focus:outline-0 focus:border-[var(---color-input-b-focus)]'
                            type="text" name="title" placeholder='Title For Your Quiz' value={quizDetails.title} onChange={setFields} disabled={!manage.createNew} />

                        <input className='px-2 py-1 rounded-md border-2 border-[var(---color-input-border)] focus:outline-0 focus:border-[var(---color-input-b-focus)]'
                            type="text" name="category" placeholder='Category of Your Quiz' value={quizDetails.category} onChange={setFields} disabled={!manage.createNew} />

                        <textarea rows={5} className='px-4 py-2 rounded-md border-2 border-[var(---color-input-border)] focus:outline-0 focus:border-[var(---color-input-b-focus)]
                    resize-none'
                            name='description' placeholder='description for your quiz' value={quizDetails.description} onChange={setFields}
                            disabled={!manage.createNew}>
                        </textarea>
                        <div><p className='text-sm text-[var(---colo-text-light)]'>*Note: You can assingn duration for each question ,if duration not assigned for entire quiz. </p></div>
                        <div className='flex justify-between gap-2'>
                            <h4 className='flex-1 text-md  text-[var(---color-text-light)]'>Duration For Entire Quiz :</h4>
                            <select className='flex-1 focus:outline-0 text-[var(---color-text-light)] text-center' name="" id=""
                                value={(
                                    quizDetails.timer.duration / 60 <= 5 && quizDetails.timer.duration / 60 > 0
                                    && quizDetails.timer.duration % 60 === 0)
                                    ? quizDetails.timer.duration / 60 : (quizDetails.timer.duration <= 0 ? '' : 'custom')}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (['1', '2', '3', '4', '5'].includes(value)) {
                                        setIsCustomTIme(false)
                                        setQuizDetails({ type: 'set', name: 'timer', value: { avail: true, duration: parseInt(value) * 60 } })
                                    } else if (value === 'custom') {
                                        setIsCustomTIme(true)
                                        setQuizDetails({ type: 'set', name: 'timer', value: { avail: true, duration: 0 } })
                                    } else {
                                        setIsCustomTIme(false)
                                        setQuizDetails({ type: 'set', name: 'timer', value: { avail: false, duration: 0 } });
                                    }
                                }}>
                                <option className='bg-[var(---color-bg)]' value=''>---No Duration---</option>
                                <option className='bg-[var(---color-bg)]' value="custom">Custom</option>
                                <option className='bg-[var(---color-bg)]' value="1">1 Minute</option>
                                <option className='bg-[var(---color-bg)]' value="2">2 Minute</option>
                                <option className='bg-[var(---color-bg)]' value="3">3 Minute</option>
                                <option className='bg-[var(---color-bg)]' value="4">4 Minute</option>
                                <option className='bg-[var(---color-bg)]' value="5">5 Minute</option>
                            </select>
                        </div>
                        {
                            isCustomTime &&
                            <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
                                <div className="flex flex-1 items-center gap-1.5">
                                    <input
                                        className="w-full p-2 border rounded"
                                        type="number"
                                        name="minutes"
                                        placeholder="0"
                                        min={0} max={60}
                                        value={customTime.min}
                                        onChange={(e) => {
                                            const minutes = parseInt(e.target.value);
                                            if (0 >= minutes <= 60) {
                                                setCustomTime((prev) => ({ ...prev, min: minutes }))
                                                const duration = (minutes * 60) + customTime.sec;
                                                setQuizDetails({ type: 'set', name: 'timer', value: { avail: true, duration: duration } });
                                            }
                                            else manager({ field: 'msg', value: { type: 'err', msg: 'Please Select valid Minutes' } })
                                        }}
                                    />
                                    <span className="text-sm">Minutes</span>
                                </div>
                                <div className="flex flex-1 items-center gap-1.5">
                                    <input
                                        className="w-full p-2 border rounded"
                                        type="number"
                                        name="seconds"
                                        placeholder="0"
                                        min={0} max={60}
                                        value={customTime.sec}
                                        onChange={(e) => {
                                            const seconds = parseInt(e.target.value);
                                            if (0 >= seconds <= 60) {
                                                setCustomTime((prev) => ({ ...prev, sec: seconds }))
                                                const duration = (customTime.min * 60) + seconds;
                                                setQuizDetails({ type: 'set', name: 'timer', value: { avail: true, duration: duration } });
                                            }
                                            else manager({ field: 'msg', value: { type: 'err', msg: 'Please Select valid Seconds' } })
                                        }}
                                    />
                                    <span className="text-sm">Seconds</span>
                                </div>
                            </div>
                        }
                        {edit &&
                            <div className='flex justify-between gap-2 mt-2.5'>
                                <h4 className='flex-1 text-md  text-[var(---color-text-light)]'>Publish :</h4>
                                <select className={`flex-1 focus:outline-0 text-[var(---color-text-light)] text-center' name="" id="" 
                                    ${edit.published ? "cursor-not-allowed " : ""}`}
                                    disabled={edit.published}
                                    value={publishNow}
                                    onChange={(e) => {
                                        let publish = e.target.value;
                                        setPublishNow(publish);
                                        switch(publish){
                                            case 'now':
                                                return setQuizDetails({type:'set',name:'schedule',value:new Date().toISOString()})
                                            case 'private':
                                                return setQuizDetails({type:'set',name:'schedule',value:null})
                                            default :
                                                return null;
                                        }
    
                                    }}
                                    >
                                    <option className='bg-[var(---color-bg)]' value="private" >Private</option>
                                    <option className='bg-[var(---color-bg)]' value="now" >Publish Now</option>
                                    <option className='bg-[var(---color-bg)]' value="schedule" >schedule</option>
                                </select>
                            </div>
                        }
                        { (publishNow === 'schedule') && 
                            <PublishInput init={quizDetails.schedule} published={edit.published} onUTCChange={(utcTime)=>setQuizDetails({type:'set',name:'schedule',value:utcTime})}/>
                        }
                        <div className='w-full mt-5'>
                            <button type="button" className='w-[140px] ml-auto  px-2 py-1 flex gap-2.5 justify-center items-center rounded-full bg-black text-white 
                      cursor-pointer disabled:bg-gray-800 disabled:cursor-not-allowed'
                                disabled={!manage.createNew}
                                onClick={ResetQuiz}>
                                <RiResetLeftFill color='white' />
                                Reset
                            </button>
                        </div>
                        <button type="submit" className='cursor-pointer px-4 py-2 rounded-full bg-black text-white 
                    disabled:bg-gray-800 disabled:cursor-not-allowed'
                            disabled={!manage.createNew}>
                            {edit ? 'Update' :'Create'}
                        </button>
                    </div>
                </>
            }

        </form>
    )
}

export default QuizForm