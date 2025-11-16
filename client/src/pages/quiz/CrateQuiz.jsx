import { SquarePen, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import QuestForm from './components/QuestForm';
import api from '../../components/api';
import ToastMsg from '../../components/util/AlertToast';

const CreateQuiz= () => {
  const location = useLocation();
  const navigate = useNavigate();
  const quizDetails = location.state;
  const alertMessage = location.alert;



  useEffect(() => {
    alertMessage && ToastMsg(alertMessage);
    if (!quizDetails || !quizDetails.quizId) {
      navigate('/', { replace: true });
    }
  }, [quizDetails, navigate]);

  const [quiz, setQuiz] = useState([]);
  const [edit, setEdit] = useState(0)


  const handleDelteQuestion = async(id) =>{
    try {
      const res = await api.delete('/quiz/remove_quest',{params:{quiz:quizDetails.quizId,id:id}});
      if(res.data.success){
        let data = res.data;
        setQuiz(prev=>prev.filter(q.id!==data.removed))
        ToastMsg({ type: 'ok', msg: data.msg || 'Question deleted successfully' })        
      }
    } catch (error) {
      const errRes = error.response.data?.err || 'Server Error';
      ToastMsg({msg:errRes,type:'err'})
    }
  }

  const handelRemoveQuestion = (id) =>{
    setQuiz(prev=>prev.filter(q=>q.id!==id));
  }

  return (
    <div>
     <QuestForm quizDetails={quizDetails} quiz={quiz} edit={edit} setEdit={setEdit} setQuiz={setQuiz} />
      <div className='w-full max-w-[800px] mx-auto '>
        {
          quiz.length > 0 ?
          quiz.map((v,i)=>{
            return <div key={i} className='flex gap-2.5 justify-between items-center mt-5  px-2 py-4 bg-[var(---color-bg)] rounded-lg shadow-md shadow-gray-300 dark:shadow-black'>
              <div className='flex-1'>
                <p className=''>
                  <span className=''>{i+1}. </span> 
                  {v.quest}
                </p>
              </div>
              <div className='flex items-center justify-end gap-2.5'>
                <div className='cursor-pointer' onClick={()=>{setEdit(v.id)}}><SquarePen size={24} color='var(---color-text-light)' /></div>
                <div className='cursor-pointer' onClick={()=>{v._id ? handleDelteQuestion(v._id) : handelRemoveQuestion(v.id)}}><Trash size={24} color='var(---color-text-light)'/></div>
              </div>
            </div>
          })
          : 
          <div className='mt-5  px-2 py-4 bg-[var(---color-bg)] rounded-lg shadow-md shadow-gray-300 dark:shadow-black'>
            <p className='text-md text-[var(---color-text-xlight)]'>No questions to show here ! </p>
          </div>
        }
      </div>
    </div>
  )
}

export default CreateQuiz