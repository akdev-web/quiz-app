import React, { useReducer, useState } from 'react'
import AlertMessage from '../../components/util/AlertMessage';
import { auth } from '../../components/api';
import { useNavigate } from 'react-router-dom';

const RequestReset = () => {
  const [email,setEmail] = useState({email:'',context:'reset'});
  const intialstate = {
    message:null,
    connecting:false,
  }

  const reducer = (state,action) =>{
    switch(action.type){
        case 'msg':
            return {...state,message:action.value};
        case 'conn':
            return {...state,connecting:action.value};
        default:
            return intialstate;
    }
  }
  const [state,dispatch] = useReducer(reducer,intialstate);
  const navigate = useNavigate()

  const sendRequest = async (e) => {
    e.preventDefault();
    dispatch({type:'conn',value:true});
    try {
      const res = await auth.post('/req/verify', email);
      if (res.data.success) {
        
        dispatch({type:'msg',value:{ type: 'ok', msg: res.data.msg }});
        dispatch({type:'conn',value:false});
        setEmail(prev=>({...prev,email:''}));
        navigate('/verify')
      }
    } catch (error) {
      dispatch({type:'msg',value:{ type: 'err', msg:error.message }});
      dispatch({type:'conn',value:false});
    }
  };

  return (
    <div className="w-full sm:w-[400px] px-4 py-10 mx-auto mt-4  bg-linear-[0deg,#d7dde4,transparent_50%] dark:bg-linear-[0deg,black,#2d2c2c] text-[var(---color-text)] sm:rounded-2xl"
      style={{boxShadow: '0 4px 8px 2px  var(---color-shadow)'}}>
      <form className="flex flex-col items-center gap-3"
            onSubmit={sendRequest}>
            <h2 className="text-3xl font-bold text-center">Request Reset Code Mail</h2>
            
            {state.message ? AlertMessage(state.message)
            :
            <p className='px-4 py-2 text-center text-md text-[var(---color-text-light)]'>Enter your email to request a password reset code.</p>}
            <input
            className='bg-[var(---color-input-bg)] placeholder-[var(---color-placeholder)] border-[var(---color-input-border)] focus:border-[var(---color-input-b-focus)] w-full px-2 py-1 mt-4 border-b-2 disabled:cursor-not-allowed outline-none transition'
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email.email}
            onChange={e => setEmail(prev=>({...prev,email:e.target.value}))}
            disabled={state.connecting}
            />
            <button
            type='submit'
            className="mt-6 w-full px-1.5 py-2 rounded-lg bg-black text-white text-center block hover:bg-gray-900 disabled:bg-gray-700 disabled:cursor-not-allowed transition cursor-pointer"
            disabled={state.connecting}   
            >
            {state.connecting ? 'Sending ...' : 'Send Email'}
            </button>
      </form>
    </div>
  )
}

export default RequestReset