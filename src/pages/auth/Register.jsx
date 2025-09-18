
import React, { useReducer, useState } from 'react'
import GoogleSignin from '../../components/GoogleSign'
import CharchaSign from '../../components/CharchaSign'
import { auth } from '../../components/api'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const initialstate = {
    username: '',
    email: '',
    password: '',
    showpass: false,
  }

  const formReducer = (state, action) => {
    switch (action.type) {
      case 'setField':
        return { ...state, [action.name]: action.value }
      case 'show':
        return { ...state, showpass: action.value }
      case 'reset':
        return initialstate;
    }
  }

  const [form, manageForm] = useReducer(formReducer, initialstate)
  const [message, setMessage] = useState(null)
  const [passFocus,setPassFocus] = useState(false)
  const [connecting,setConnecting] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    /// valdate the inputs here

  }

  const handleForm = async () => {
    setConnecting(true);
    validateForm();
    setMessage(null)
    try {
      const res = await auth.post('/register', form);
      console.log(res)
      if (res.data.success) {
        // manageForm({type:'setField',name:'message',value:{type:'ok',msg:res.data.msg}})
        setMessage({ type: 'ok', msg: res.data.msg });
        setConnecting(false)
        manageForm({ type: 'reset' });
        navigate(`/verify?e=${res.data.user.email}`)
      }
    } catch (error) {
      setConnecting(false)
      const errdata = error.response.data || 'Server Error';
      // manageForm({type:'setField',name:'message',value:{type:'err',msg:errdata.err}})
      setMessage({ type: 'err', msg: errdata.err });
    }
  }

  return (
    <div className='w-full sm:w-[400px]  px-4 py-10 mx-auto mt-[150px] bg-linear-[0deg,#d7dde4,transparent_50%] dark:bg-linear-[0deg,black,#2d2c2c] text-[var(---color-text)] sm:rounded-2xl '
      style={{boxShadow: '0 4px 8px 2px  var(---color-shadow)'}}>
      <div className='flex flex-col items-center justify-center gap-3 '>
        <div className='w-full flex flex-col  gap-5'>
          <h2 className='text-3xl font-bold font-sans text-center mb-10'>Sign Up</h2>

          {
            (message && !message.type) &&
            <p className='px-4 py-2 bg-gray-200 text-gray-800  text-sm'>Normal Message</p>
          }
          {
            (message && message.type === 'err') &&
            <p className='px-4 py-2 bg-red-200 text-red-800 text-sm'>{message.msg}</p>

          }
          {
            (message && message.type === 'ok') &&
            <p className='px-4 py-2 bg-green-200 text-green-800  text-sm'>{message.msg}</p>

          }



          <input className='bg-[var(---color-input-bg)] placeholder-[var(---color-placeholder)] border-[var(---color-input-border)] focus:border-[var(---color-input-b-focus)] px-1.5 py-1 outline-none focus:outline-0 border-b-2 transition-colors duration-300'
            type="text" name="username" id="" placeholder='Enter your username'
            value={form.username} onChange={(e) => { manageForm({ type: 'setField', name: e.target.name, value: e.target.value }) }} />

          <input className='bg-[var(---color-input-bg)] placeholder-[var(---color-placeholder)] border-[var(---color-input-border)] focus:border-[var(---color-input-b-focus)] px-1.5 py-1 outline-none focus:outline-0 border-b-2  transition-colors duration-300'
            type="email" name="email" id="" placeholder='Enter your Email'
            value={form.email} onChange={(e) => { manageForm({ type: 'setField', name: e.target.name, value: e.target.value }) }} />

          <div className={`bg-[var(---color-input-bg)] w-full flex gap-2 items-center justify-between px-1.5 py-1  border-b-2  transition-colors duration-300
            ${passFocus ?'border-[var(---color-input-b-focus)]' : 'border-[var(---color-input-border)]'}`}>
            <input className='flex-1 outline-none focus:outline-0'
              type={form.showpass ? 'text' : 'password'} name="password" id="" placeholder='Enter password'
              onFocus={()=>{setPassFocus(true)}} onBlur={()=>{setPassFocus(false)}}
              value={form.password} onChange={(e) => { manageForm({ type: 'setField', name: e.target.name, value: e.target.value }) }} />
  
            <button className='text-lg '
              onClick={(e) => { manageForm({ type: 'show', value: !form.showpass }) }}>
              {form.showpass ? <EyeOff size={24} color='var(---color-text)'/> : <Eye  size={24} color='var(---color-text)' /> }
            </button>
          </div>
          <div className='text-center text-sm text-[var(---color-link)] hover:text-[var(---color-link-hover)] underline cursor-pointer transition-colors duration-150'>
              <Link to='/login'>Already Registered ? Login Here </Link>
          </div>
          <button className='mt-6 px-1.5 py-1 w-full rounded-lg cursor-pointer bg-black text-white text-xl disabled:cursor-not-allowed'
            disabled={connecting}
            type='click' onClick={handleForm}>{connecting ? 'Signing ....': 'Sign up'}</button>
        </div>
      </div>
    </div>
  )
}

export default Register
