import React, { useEffect, useState } from 'react'
import { useReducer } from 'react';
import QuizForm from '../quiz/components/QuizForm';
import api from '../../components/api';
import QuizCardDash from './components/QuizCardDash';

const Dashboard = () => {

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
  const [edit, setEdit] = useState(null);
  const [myQuiz, setMyquiz] = useState([])
  const [loading,setLoading] = useState(false)

  const get_quizes = async () => {
    try {
      setLoading(true)
      const res = await api.get('/dashboard/quiz');
      if (res.data.success) {
        let quizresult = res.data?.data;
        if (quizresult) setMyquiz(quizresult);
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
        manager({ type: 'msg', value: { type: 'err', msg: err.message } });
    }
  }


  useEffect(() => {
    get_quizes();
  }, [])



  return (
    <div>
      {
        edit ?
          <QuizForm edit={edit} setEdit={setEdit} manage={manage} manager={manager} />
          :
          <QuizForm manage={manage} manager={manager} />
      }

      
      {
        loading ? 
          <>
            <div className='mt-10 w-12 h-12 border-4 border-gray-300 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mx-auto'></div>
          </>
        :
        myQuiz.length === 0 ?
            <p className='mt-4 text-center bg-[var(---color-bg)] px-2 py-4 font-semibold'> No quiz created yet.</p>
        :
        <div className='mt-10 grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3'>
          {
              myQuiz.map((quiz,i) => {
                return <QuizCardDash key={i} quiz={quiz.quiz} totalParticipants={quiz.totalParticipants} topParticipants={quiz.topParticipants}
                  edit={setEdit}
                  refreshQuizDashboard={() => { get_quizes() }}
                />
              })
          }
        </div>
      }
      
    </div>
  )
}

export default Dashboard;