import React, { useEffect, useMemo, useState } from 'react'
import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../components/api';
import QuizCard from './components/QuizCard';
import QuizForm from './components/QuizForm';
import useUserContext from '../../context/UserContext';
import Blockpopup from '../../components/Blockpopup';
import QuizCardSkel from './components/QuizCardSkel';

const Quiz = () => {
 
  
  const [loading,setLoading] = useState(true);
  const [showPopup,setShowPopup]= useState(false);
  const {Logout} = useUserContext();
  const [edit,setEdit] = useState(null);
  const [quiz,setQuiz] = useState([])
  const [gridCols,setGridCols] = useState(1);
  const navigate = useNavigate();


  const skelArray = useMemo(() => {
      return Array.from(
          { length: Math.floor(Math.random() * (20 - 15 + 1)) + 15 },
          (_, i) => ({
            usernameWidth: 30+ Math.random() * 20+'%',
            titleWidth: 40 + Math.random() * 50+'%', // 40% to 90%
            descWidth1: 100+'%', // 50% to 100%
            descWidth2: 0 + Math.random() * 70+'%', // 30% to 100%
            durationWidth: 20 + Math.random() * 30+'%', // 20% to 50%
            delay: Math.random() * 1.5, // 0s to 1.5s animation delay
          })
      );
  }, []);

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


    const handleResize = () =>{
      if(window.innerWidth <640) setGridCols(1)
      else if(window.innerWidth <768) setGridCols(2)
      else if(window.innerWidth < 1280) setGridCols(3)
      else if(window.innerWidth >=1280) setGridCols(4); 
    }
    handleResize()
    window.addEventListener('resize',handleResize);

    return()=>{
      window.removeEventListener('resize',handleResize);
    }
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
          <div className='mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 '>
            {
              skelArray.map((s,id)=>{
                return <QuizCardSkel key={id} skelton={s}/>
              })
            }
          </div>
            <div className='mt-10 w-12 h-12 border-4 border-gray-300 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mx-auto'></div>
          </>
        :
        quiz?.length <= 0 ?
        <p className='mt-4 text-center bg-[var(---color-bg)] px-2 py-4 font-semibold'> No quiz recommendations yet.</p>
        :
        <div className='mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 '>
          {
            quiz.map((_quiz,i)=>{
              const toRender = quiz.length-Math.floor(quiz.length%gridCols);
              if(i>=toRender) return;
              return <QuizCard key={_quiz.quizId} quiz={_quiz} edit={setEdit}/>
            })
          }
        </div>
      }
      
    </div>
  )
}

export default Quiz;