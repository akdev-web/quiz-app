
import { useEffect, useReducer, useRef, useState } from 'react'
import { auth } from '../../components/api'
import { Link, useLocation } from 'react-router-dom'
import useUserContext from '../../context/UserContext'
import { jwtDecode } from 'jwt-decode'
import ToastMsg from '../../components/util/AlertToast'
import { Eye, EyeOff } from 'lucide-react'


const Login = () => {
  const initialstate = {
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
  const [passFocus, setPassFocus] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const {Login} = useUserContext();
  const location = useLocation();
  const loaded = useRef(false);

  useEffect(()=>{
    if(loaded.current) return;
    loaded.current = true;
    if(location.state){
      ToastMsg(location.state.alert);
    }
  },[])

  const handleForm = async () => {
    setConnecting(true);
    let wakingUP = setTimeout(()=>{
      setMessage({ type: 'err', msg: 'Hold on tight. Server takiing too long to respond !' });  
    },2000);
    try {
      const res = await auth.post('/login', form);
      if (res.data.success) {
        if(wakingUP) clearTimeout(wakingUP);
        let data = res.data;
        setMessage({ type: 'ok', msg: data.msg })
        setConnecting(false);
        manageForm({ type: 'reset' });
        const payload = jwtDecode(data.access);
        Login(payload.user,data.access);    
      }
    } catch (error) {
      console.log(error);
      if(wakingUP) clearTimeout(wakingUP);
      if (error.data?.forceVerify) { setRequestverify(true) }
      setMessage({ type: 'err', msg: error.message});
      setConnecting(false);
      
    }
  }

  return (
    <div className='w-full sm:w-[400px]  px-4 py-10 mx-auto mt-4 bg-linear-[0deg,#d7dde4,transparent_50%] dark:bg-linear-[0deg,black,#2d2c2c] text-[var(---color-text)]  sm:rounded-2xl 
       ' style={{boxShadow: '0 4px 8px 2px  var(---color-shadow)'}}>
      <div className='flex flex-col items-center justify-center gap-3 '>
        <form className='w-full flex flex-col  gap-5' onSubmit={(e) => { e.preventDefault(); handleForm() }}>
          <h2 className='text-3xl font-bold font-sans text-center mb-10'>Login</h2>
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

          <input className='px-1.5 py-1  outline-none focus:outline-0 border-b-2  bg-[var(---color-input-bg)] placeholder-[var(---color-placeholder)] border-[var(---color-input-border)] focus:border-[var(---color-input-b-focus)] disabled:cursor-not-allowed transition-colors duration-300'
            type="email" name="email"  placeholder='Enter your Email'
            value={form.email} onChange={(e) => { manageForm({ type: 'setField', name: e.target.name, value: e.target.value }) }} 
            disabled={connecting}  
          />
         
           
          
          <div className={`bg-[var(---color-input-bg)]  w-full flex gap-2 items-center justify-between px-1.5 py-1  border-b-2  transition-colors duration-300
              ${passFocus ? 'border-[var(---color-input-b-focus)]' : 'border-[var(---color-input-border)]'}`}>
            <input className='flex-1 outline-none focus:outline-0 placeholder-[var(---color-placeholder)] disabled:cursor-not-allowed'
              type={form.showpass ? 'text' : 'password'} name="password"  placeholder='Enter password'
              onFocus={() => { setPassFocus(true) }} onBlur={() => { setPassFocus(false) }}
              value={form.password} onChange={(e) => { manageForm({ type: 'setField', name: e.target.name, value: e.target.value }) }} 
               disabled={connecting}   
            />

            <button className='text-lg ' type='button'
              onClick={(e) => { manageForm({ type: 'show', value: !form.showpass }) }}>
              {form.showpass ? <EyeOff size={24}/> : <Eye  size={24} color='var(---color-text)' />}
            </button>
          </div>
          <div className='mt-5 flex flex-col gap-2'>
            <div className={`text-sm text-[var(---color-link)]  transition-colors duration-150 
              ${connecting ? 'cursor-not-allowed' : 'underline hover:text-[var(---color-link-hover)] cursor-pointer'}`}>
              { connecting ? <span> Forgot Password </span> : <Link  to='/request-reset'>Forgot Password</Link> }
            </div>
            <div className={`text-sm text-[var(---color-link)]  transition-colors duration-150 
              ${connecting ? 'cursor-not-allowed' : 'underline hover:text-[var(---color-link-hover)] cursor-pointer'}`}>
              { connecting ? <span> Register Here </span> :  <Link  to='/register'>New User ? Register Here</Link> }
            </div>
          </div>
          <button className='mt-6 px-1.5 py-1 w-full rounded-lg cursor-pointer bg-black text-white text-xl disabled:cursor-not-allowed'
            disabled={connecting}
            type='submit' >{connecting ? 'Loging in...' : 'Login'}</button>
  
        </form>
      </div>
    </div>
  )
}

export default Login
