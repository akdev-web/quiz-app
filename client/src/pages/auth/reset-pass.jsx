import React, { useEffect, useReducer, useState } from 'react'
import AlertMessage from '../../components/util/AlertMessage';
import { Eye, EyeOff } from 'lucide-react';
import  { auth } from '../../components/api';

const Reset = () => {
  const [body, setBody] = useState({ password: '', confirm: '', match: false });

  useEffect(() => {
    const bothFilled = body.password !== '' && body.confirm !== '';
    const match = body.password === body.confirm;

    if (bothFilled) {
      setBody(prev => ({ ...prev, match }));
    } else {
      setBody(prev => ({ ...prev, match: null }));
    }
  }, [body.password, body.confirm]);

  const reducer = (state, action) => {
    switch (action.type) {
      case 'req':
        return { ...state, requesting: action.value }
      case 'msg':
        return { ...state, message: action.value };
      case 'show':
        return { ...state, showpass: action.value };
      case 'reset':
        return intialstate;
      default:
        return state;
    }
  }
  const intialstate = {
    message: null,
    requesting: false,
    showpass: false,
  }
  const [state, dispatch] = useReducer(reducer, intialstate);
  const [passFocus, setPassFocus] = useState(false);

  const handleSubmit = async(e) => {
    dispatch({ type: 'msg', value: null });
    dispatch({ type: 'req', value: true });
    e.preventDefault();
    try {
      const res = await auth.post('/reset-pass',body);
      if(res.data.success){
        dispatch({ type: 'msg', value: { type: 'ok', msg: res.data.msg } });
        dispatch({ type: 'req', value: false });
      }
    } catch (error) {
        dispatch({ type: 'msg', value: { type: 'err', msg: error.message } });
        dispatch({ type: 'req', value: false }); 
    }
  }
  return (
    <div className="bg-linear-[0deg,#d7dde4,transparent_50%] dark:bg-linear-[0deg,black,#2d2c2c] text-[var(---color-text)] w-full sm:w-[400px] px-4 py-10 mx-auto mt-4 sm:rounded-2xl"
      style={{boxShadow: '0 4px 8px 2px  var(---color-shadow)'}}>
      <form className="flex flex-col items-center gap-3" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center">Reset Your Password</h2>

        <p className="text-sm text-center mt-2">
          {state.message && AlertMessage(state.message)}
        </p>
        <input className={`bg-[var(---color-input-bg)] placeholder-[var(---color-placeholder)] border-[var(---color-input-border)] focus:border-[var(---color-input-b-focus)] w-full px-1.5 py-1 border-b-2 outline-0  transition-colors duration-300
           disabled:cursor-not-allowed `}
          type='password' name="password"  placeholder='Enter password'
          disabled={state.requesting}
          value={body.password} onChange={(e) => { setBody(prev => ({ ...prev, [e.target.name]: e.target.value })) }} />

        <div className={`w-full  flex gap-2 items-center justify-between px-1.5 py-1  border-b-2  transition-colors duration-300
              ${body.match!=null ? 
                body.match ? 
                  passFocus ? 'border-green-500' : 'border-green-300'
                  : passFocus ? 'border-red-500' : 'border-red-300'
                :
                passFocus ? 'border-[var(---color-input-b-focus)]' : 'border-[var(---color-input-border)]'
              }
              `}>
          <input className='bg-[var(---color-input-bg)] placeholder-[var(---color-placeholder)] border-[var(---color-input-border)] focus:border-[var(---color-input-b-focus)] flex-1 outline-none focus:outline-0 disabled:cursor-not-allowed '
            type={state.showpass ? 'text' : 'password'} name="confirm"  placeholder='Confirm password'
            disabled={state.requesting}
            onFocus={() => { setPassFocus(true) }} onBlur={() => { setPassFocus(false) }}
            value={body.confirm} onChange={(e) => { setBody(prev => ({ ...prev, [e.target.name]: e.target.value })) }} />

          <button className='text-lg '
            onClick={(e) => { dispatch({ type: 'show', value: !state.showpass }) }}>
            {state.showpass ? <EyeOff size={24} color='var(---color-text)'/> : <Eye  size={24} color='var(---color-text)' /> }
          </button>
        </div>
        <button
          type='submit'
          disabled={state.requesting}
          className="mt-6 w-full px-1.5 py-2 rounded-lg bg-black text-lg text-white text-center block hover:bg-gray-900 transition disabled:cursor-not-allowed "
        >
          Reset
        </button>
      </form>
    </div>
  )
}

export default Reset