import React, { useEffect, useState } from 'react'
import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../components/api';
import QuizCard from './components/QuizCard';
import QuizForm from './components/QuizForm';
import useUserContext from '../../context/UserContext';
import Blockpopup from '../../components/Blockpopup';

const Quiz = () => {
 
  
  const [loading,setLoading] = useState(true);
  const [showPopup,setShowPopup]= useState(false);
  const {Logout} = useUserContext();
  const [edit,setEdit] = useState(null);
  const [quiz,setQuiz] = useState([])
  const navigate = useNavigate();


  useEffect(()=>{
    const get_quizes = async() =>{
      setLoading(true)
      try {
        const res = await api.get('/quiz');
        if(res.data.success){
          setLoading(false)
          let quizzes =res.data?.data;
          if(quizzes) setQuiz(quizzes);
        }
      } catch (err) {
        setLoading(false)
        if(err.response?.data){
          const errRes = err.response.data;
          if(errRes.loggedout){
            setShowPopup(true);
          }
        }
      }
    }

    get_quizes();
  },[])


  if(showPopup){
    return(
      <Blockpopup onClose={()=>{navigate('/login'); Logout();}} />
    )
  }
 

  return (
    <div>
      {
        edit ?
        <QuizForm edit={edit} setEdit={setEdit} />
        :
        <QuizForm />
      }
      {
        loading ?
          <>
            <div className='mt-10 w-12 h-12 border-4 border-gray-300 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mx-auto'></div>
          </>
        :
        quiz?.length <= 0 ?
        <p className='mt-4 text-center bg-[var(---color-bg)] px-2 py-4 font-semibold'> No quiz recommendations yet.</p>
        :
        <div className='mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
          {
            quiz.map((quiz)=>{
              return <QuizCard key={quiz.quizId} quiz={quiz} edit={setEdit}/>
            })
          }
        </div>
      }
      
    </div>
  )
}

export default Quiz;