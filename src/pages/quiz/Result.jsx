import React, { useEffect, useRef, useState } from 'react'
import api from '../../components/api';
import { useNavigate, useParams } from 'react-router-dom';
import GetTime from '../../components/util/DurationToTIme';
import ToastMsg from '../../components/util/AlertToast';
import { Timer } from 'lucide-react';

const Result = () => {
  const quizId = useParams().id;
  if (!quizId) return <div>Not Found</div>;
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentDetail, setCurrentDetail] = useState(null)
  const [detailCounter, setDetailCounter] = useState(0);
  const [jumpQues, setJumpQues] = useState(0);

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${quizId}`);
        if (res.data.success) {
          let data = res.data;
          setQuiz(data.quiz);
        }
      } catch (error) {
        ToastMsg({ type: 'err', msg: error.response?.data?.err || 'Failed to fetch quiz data' });
        navigate('/', { replace: true });
      }
    }
    getQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!result?.details) return;
    setCurrentDetail(result.details[detailCounter]);
  }, [detailCounter, result?.details])

  async function getResult() {
    try {
      const res = await api.get(`submit_quiz/result/${quizId}`);
      if (res.data?.success) {
        const result = res.data;
        setResult({
          summary: result.resultSummary,
          details: result.resultDetails,
          totalTimeSpent: result.timespent,
        })
      }
    } catch (error) {
      const data = error.response.data;
      if (!data.participated) {
        navigate(`/quiz/participate/${quizId}`, { state: { alert: { msg: data.err, type: 'err' } } });
      }
    }
  }
  useEffect(() => { getResult() }, [])

  if (!result) {
    return (
      <div>Loading ....</div>
    )
  }

  // Calculate summary stats
  const totalQuestions = result.summary ? result.summary.length : 0;
  const correctAnswers = result.summary ? result.summary.filter(q => q.correct === true).length : 0;
  const skippedQuestions = result.summary ? result.summary.filter(q => q.skipped === true).length : 0;
  const timeoutQuestions = result.summary ? result.summary.filter(q => q.timeout === true).length : 0;
  const answeredQuestions = totalQuestions - (skippedQuestions + timeoutQuestions);



  return (
    <div className='sm:max-w-[800px] mx-auto'>
      {
        quiz &&
        <div className='bg-[var(---color-bg)] px-4 py-5 rounded-md'>
          <div>
            <h2 className='text-3xl text-center mb-5'>{quiz.title?.toUpperCase()}</h2>
            <p className='text-[var(---color-text-light)] text-center mb-5'>{quiz.description}</p>
          </div>
          <div className='text-[var(---color-text-xlight)]'>
            {quiz.timer.avail ?
              <p>Time Duration of Quiz : {<GetTime duration={quiz.timer.duration} sec={true} />}
              </p> :
              <p>No time limit for this quiz</p>
            }
            {result?.totalTimeSpent && <p>Time Spent By You : {<GetTime duration={result.totalTimeSpent} />}</p>}
          </div>
        </div>
      }
      {
        result.summary &&
        <div className='bg-[var(---color-bg)] px-4 py-5 rounded-md mt-10'>
          <h3 className='text-2xl font-medium text-center mb-5'>Result Summary</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <div className="bg-[var(---color-bg-light)] px-4 py-2 rounded shadow text-center">
              <span className="block text-lg font-bold">{totalQuestions}</span>
              <span className="text-xs text-[var(---color-text-xlight)]">Total Questions</span>
            </div>
            <div className="bg-[var(---color-bg-light)] px-4 py-2 rounded shadow text-center">
              <span className="block text-lg font-bold">{skippedQuestions}</span>
              <span className="text-xs text-[var(---color-text-xlight)]">Skipped Questions</span>
            </div>
            <div className="bg-[var(---color-bg-light)] px-4 py-2 rounded shadow text-center">
              <span className="block text-lg font-bold">{timeoutQuestions}</span>
              <span className="text-xs text-[var(---color-text-xlight)]">TimeOut Questions</span>
            </div>
            <div className="bg-[var(---color-bg-light)] px-4 py-2 rounded shadow text-center">
              <span className="block text-lg font-bold">{answeredQuestions}</span>
              <span className="text-xs text-[var(---color-text-xlight)]">Answered</span>
            </div>
            <div className="bg-[var(---color-bg-light)] px-4 py-2 rounded shadow text-center">
              <span className="block text-lg font-bold">{correctAnswers}</span>
              <span className="text-xs text-[var(---color-text-xlight)]">Correct Answers</span>
            </div>
          </div>
          <div className="divide-y divide-[var(---color-bg-light)]">
            {
              result.summary.map((res) => (
                <div className='flex justify-between gap-2.5 py-2 text-[var(---color-text-light)]' key={res.questionNo}>
                  <p>
                    <span className='mr-2 font-semibold'>{res.questionNo}.</span>
                    {res.question}
                  </p>
                  {
                    res.timeout ?
                    <Timer  size={24} color='red' /> :
                    res.skipped ?
                    <CircleDashed size={24} color='red' /> :
                    <p className={`font-semibold ${res.correct ? 'text-green-600' : 'text-red-500'}`}>
                      {res.correct ? '✔️' : '❌'}
                    </p>
                  }
                </div>
              ))
            }
          </div>
        </div>
      }
      {
        result.details &&
        <div className='bg-[var(---color-bg)] px-4 py-5 rounded-md mt-10'>
          <div className='flex justify-between'>
            <h3 className='text-2xl font-medium text-center mb-5'>Result Details</h3>
            <p>{detailCounter + 1} of {result.details.length} <span>TimeSpent : {currentDetail && <GetTime duration={currentDetail.timespent} />}</span></p>
          </div>
          {
            currentDetail &&
            <div>
              <p className='text-lg text-center'>{currentDetail.question.quest}</p>
              <div className='mt-5 text-center text-[var(---color-text-light)]'>
                <p className={`my-2.5 font-semibold ${currentDetail.correct ? 'text-green-600' : 'text-red-500'}`} >
                  { currentDetail.skipped ? 
                      'Skipped' : 
                    currentDetail.timeout ? 
                      'Timeout' : 
                    currentDetail.correct ? 'Correct' : 'Incorrect'}
                </p>
                {
                  currentDetail.question.options.map((opt) => {
                    return <div key={opt.id} className={`p-2 mb-4 border-2  
                      ${currentDetail.answer === opt.id ?
                        currentDetail.correct ? 'border-[var(--border-correct)]' : 'border-[var(--border-incorrect)]'
                        :
                        currentDetail.question.ans === opt.id ?
                          'border-[var(--border-correct)]' : 'border-[var(--border-default)]'
                      }`}>{opt.option}</div>
                  })
                }
              </div>
            </div>
          }
          <div className='flex justify-between'>
            <button className={`px-4 py-1 font-light border-2 rounded-md  
              ${detailCounter >=1 ? 'cursor-pointer' : 'cursor-not-allowed text-[var(---color-text-xlight)] border-[var(--border-default)]'}`}
              type='button' 
              onClick={() => setDetailCounter(prev => prev - 1)}
              disabled={detailCounter >=1 ? false : true} >
                Prev
            </button>
            <div className='flex flex-col items-center ml-auto mr-auto gap-2'>
              {(jumpQues < 0 || jumpQues > result.details.length ) &&
                <p className='text-red-500 text-sm text-center'>Question Number Out of Range</p>}
              <div className='flex items-center gap-2'>
                <span>Jump to :</span>
                <input className='min-w-2.5 text-center px-4 py-1 font-light border-2 rounded-md '  type="number"
                  value={jumpQues+1} 
                  min={1} max={result.details.length+1} id="" 
                  onChange={(e)=>{
                    setJumpQues(e.target.value-1);
                    if(e.target.value > 0 && e.target.value <= result.details.length){
                      setDetailCounter(e.target.value-1)
                    }
                  }}/>
              </div>
            </div>
              <button className={`px-4 py-1 font-light border-2 rounded-md  
                ${detailCounter < result.details.length-1 ? 'cursor-pointer' : 'cursor-not-allowed text-[var(---color-text-xlight)] border-[var(--border-default)]'} `}
                type='button' 
                onClick={() => setDetailCounter(prev => prev + 1)}
                disabled={detailCounter < result.details.length-1 ? false : true} >Next</button>
          </div>
        </div>
      }
    </div>
  )
}

export default Result