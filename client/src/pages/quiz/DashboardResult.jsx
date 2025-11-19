import React, { useEffect, useRef, useState } from 'react'
import api from '../../components/api';
import { useNavigate, useParams } from 'react-router-dom';
import GetTime from '../../components/util/DurationToTIme';
import ToastMsg from '../../components/util/AlertToast';
import { Eye } from 'lucide-react';

const DashboardResult = () => {
  const quizId = useParams().id;
  if (!quizId) return <div>Not Found</div>;
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [summaryStats, setSummaryStats] = useState({
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
  });
  const [rankList, setRanKList] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [pageState,setPagestate]=useState({
    loading:true, error:false,
    msg:null,
  });

  
  useEffect(() => {
    async function getRankList() {
      setPagestate({loading:true,error:false,msg:null});
      try {
        const res = await api.get(`dashboard/result/${quizId}`);
        if (res.data?.success) {
          const result = res.data;
          setRanKList(result.rankList);
        }
      } catch (error) {
        const data = error.response.data;
        ToastMsg({ type: 'err', msg: data.err || 'Failed to fetch result data' });
      }
    }

    const getQuiz = async () => {
      setPagestate({loading:true,error:false,msg:null});
      try {
        const res = await api.get(`/quiz/${quizId}`);
        if (res.data.success) {
          let data = res.data;
          setQuiz(data.quiz);
          setPagestate({loading:false,error:false,msg:data.msg});
        }
      } catch (error) {
        const err = error.response?.data?.err || 'Failed to fetch quiz data';
        setPagestate({loading:false,error:true,msg:err});
        ToastMsg({ type: 'err', msg: err });
      }
    }

    getQuiz();
    getRankList();
  }, [quizId]);


  async function getParticpantResult(user) {
    try {
      const res = await api.get(`dashboard/result/${quizId}`, { params: { user } });
      if (res.data?.success) {
        const data = res.data;
        console.log(data);
        setResult({
          user: data.result.user,
          summary:null,
          details: data.result.resultDetails,
          totalTimeSpent: data.result.timespent,
        })
        setSummaryStats({
          totalQuestions: result.summary ? result.summary.length : 0,
          answeredQuestions: result.details ? result.details.length : 0,
          correctAnswers: result.summary ? result.summary.filter(q => q.correct === true).length : 0,
        })
      }
    } catch (error) {
      const data = error.response.data;
      console.log(data);
    }
  }




  if (pageState.loading) {
    return (
      <>
        <div className='mt-10 w-12 h-12 border-4 border-gray-300 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mx-auto'></div>
        <p className='text-center text-[var(---color-text-xlight)] mt-4'>Please wait while fetching ...</p>
      </>
    )
  }

  if (pageState.error) {
    return (
      <>
        <div className='text-center text-red-600'>Error : {pageState.msg}</div>
        <div className='text-center mt-5'>
          <button className='px-4 py-2 border-2 rounded-md cursor-pointer'
            type='button' onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </>  
  )}

  return (
    <div className='sm:max-w-[800px] mx-auto'>
      {
        quiz &&
        <div className='bg-[var(---color-bg)] px-4 py-5 rounded-md'>
          {quiz.thumbnail?.url && <img className='max-h-68  object-cover rounded-md mb-4 max-w-[500px] mx-auto shadow-lg shadow-black' src={quiz.thumbnail.url} alt=""  /> }
          <div>
            <h2 className='text-3xl text-center mb-5'>{quiz.title?.toUpperCase()}</h2>
            <p className='text-[var(---color-text-light)] text-center mb-5'>{quiz.description}</p>
          </div>
          <div className='text-[var(---color-text-xlight)]'>
            {quiz.timer.avail ?
              <p> Duration of Quiz : {<GetTime duration={quiz.timer.duration} sec={true} />}
              </p> :
              <p>No time limit for this quiz</p>
            }
          </div>
        </div>
      }

      { rankList.length === 0 ?
         <div className='bg-[var(---color-bg)] px-2 py-4 rounded-md mt-10 text-center'>
            <p>No Partcipants in this QUIZ </p>
         </div>
        :
        (<div className='bg-[var(---color-bg)] px-2 py-4 rounded-md mt-10'>
          <h3 className='text-2xl font-medium text-center mb-5'>Rank List</h3>
          <div className="w-full overflow-x-auto">
            <table className="min-w-[600px] w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(---color-bg-light)]">
                  <th className="px-2 py-2 font-semibold text-xs sm:text-sm">#</th>
                  <th className="px-2 py-2 font-semibold text-xs sm:text-sm">Name</th>
                  <th className="px-2 py-2 font-semibold text-xs sm:text-sm">Correct</th>
                  <th className="px-2 py-2 font-semibold text-xs sm:text-sm">Incorrect</th>
                  <th className="px-2 py-2 font-semibold text-xs sm:text-sm">Time Spent</th>
                  <th className="px-2 py-2 font-semibold text-xs sm:text-sm">Result</th>
                </tr>
              </thead>
              <tbody>
                {rankList.map((res, index) => (
                  <tr
                    key={res.userId}
                    className="transition hover:bg-[var(---color-bg-light)] hover:opacity-70 cursor-pointer"
                    onClick={() => getParticpantResult(res.userId)}
                  >
                    <td className="px-2 py-2 text-xs sm:text-sm">{index + 1}</td>
                    <td className="px-2 py-2 text-xs sm:text-sm">{res.user.name}</td>
                    <td className="px-2 py-2 font-semibold text-xs sm:text-sm">{res.correctCounts}</td>
                    <td className="px-2 py-2 font-semibold text-xs sm:text-sm">{res.inCorrectCounts}</td>
                    <td className="px-2 py-2 font-semibold text-xs sm:text-sm">
                      <GetTime duration={res.timeSpent}  />
                    </td>
                    <td className="px-2 py-2">
                      <button
                        className="p-2 border-2 rounded-md cursor-pointer transition flex items-center justify-center"
                        type="button"
                        aria-label="View Result"
                      >
                        <Eye size={20} className="text-[var(---color-text)]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {
        result?.summary &&
        <div className='bg-[var(---color-bg)] px-4 py-5 rounded-md mt-10'>
          <h3 className='text-2xl font-medium text-center mb-5'>Result Summary</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <div className="bg-[var(---color-bg-light)] px-4 py-2 rounded shadow text-center">
              <span className="block text-lg font-bold">{summaryStats.totalQuestions}</span>
              <span className="text-xs text-[var(---color-text-xlight)]">Total Questions</span>
            </div>
            <div className="bg-[var(---color-bg-light)] px-4 py-2 rounded shadow text-center">
              <span className="block text-lg font-bold">{summaryStats.answeredQuestions}</span>
              <span className="text-xs text-[var(---color-text-xlight)]">Answered</span>
            </div>
            <div className="bg-[var(---color-bg-light)] px-4 py-2 rounded shadow text-center">
              <span className="block text-lg font-bold">{summaryStats.correctAnswers}</span>
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
                  <p className={`font-semibold ${res.correct ? 'text-green-600' : 'text-red-500'}`}>
                    {res.correct ? '✔️' : '❌'}
                  </p>
                </div>
              ))
            }
          </div>
        </div>
      }
      {
        result?.details &&
        <div className=''>
          <div className='bg-[var(---color-bg)] flex justify-between px-4 py-5 mt-10'>
            <h3 className='text-2xl font-medium text-center mb-5'>{result.user.name}'s  Result</h3>
            <p>Total TimeSpent :  <GetTime duration={result.totalTimeSpent}  /></p>
          </div>
          {
            result.details.map((detail, idx) => (
              <div className='mb-8 bg-[var(---color-bg)]  px-4 py-5 rounded-md mt-10' key={idx}>
                <p className='text-lg '><span>Q: {idx+1}</span> {detail.question.quest}</p>
                <p className={` my-2.5 ${detail.correct ? 'text-green-600' : 'text-red-500'}`} >
                  {detail.status.toUpperCase()}
                </p>
                <div className='mt-5 text-center text-[var(---color-text-light)]'>
                  {
                    detail.question.options.map((opt) => {
                      return <div key={opt.id} className={`p-2 mb-4 border-2  
                        ${detail.answer === opt.id ?
                          detail.correct ? 'border-[var(--border-correct)]' : 'border-[var(--border-incorrect)]'
                          :
                          detail.question.ans === opt.id ?
                            'border-[var(--border-correct)]' : 'border-[var(--border-default)]'
                        }`}>{opt.option}</div>
                    })
                  }
                </div>
                <p>Time Spent : <GetTime duration={detail.timespent} /></p>
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}

export default DashboardResult