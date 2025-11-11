import React, { useEffect, useState } from 'react'
import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../components/api';
import QuizCard from './components/QuizCard';
import QuizForm from './components/QuizForm';

const Quiz = () => {
 
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
  const [edit,setEdit] = useState(null);
  const [myQuiz,setMyquiz] = useState([])


  useEffect(()=>{
    const get_quizes = async() =>{
      try {
        const res = await api.get('/quiz');
        if(res.data.success){
          let quizzes =res.data?.data;
          if(quizzes) setMyquiz(quizzes);
        }
      } catch (err) {
        if(err.response?.data){
          manager({type:'msg',value:{type:'err',msg:err.response.data.err}});
        }
        console.log(err);
      }
    }

    get_quizes();
  },[])

 

  return (
    <div>
      {
        edit ?
        <QuizForm edit={edit} setEdit={setEdit} manage={manage} manager={manager}/>
        :
        <QuizForm manage={manage} manager={manager}/>
      }
      <div className='mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {
          myQuiz.map((quiz)=>{
            return <QuizCard key={quiz.quizId} quiz={quiz} edit={setEdit}/>
          })
        }
      </div>
    </div>
  )
}

export default Quiz;