import { useRef, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { auth } from '../../components/api';

const Verify = () => {
  const cooldown = useRef(0);
  const [counter,setCounter]= useState(null)
  const timer = (seconds) =>{
    if(cooldown.current) return;
    setCounter(seconds);

    cooldown.current = setInterval(()=>{
      setCounter(prev=>{
        if(prev <=1){
          clearInterval(cooldown.current);
          cooldown.current = null;
          return 0;
        }
        return prev-1;
      })
    },1000)

  }



  const [code, setCode] = useState('');
  const [message, setMessage] = useState(null);
  const [state, setState] = useState({ requesting: false, verified: false });
  const [rediret,setRedirect] = useState(null)
  const navigate = useNavigate()

  const sendRequest = async () => {
    setState(prev => ({ ...prev, requesting: true }));
    try {
      const res = await auth.post('/req/verify',{context:'resend'});
      if (res.data.success) {
        timer(120);
        setMessage({ type: 'ok', msg: res.data.msg });
        setState(prev => ({ ...prev, requesting: false }));
      }
    } catch (error) {
      setMessage({ type: 'err', msg: error.message });
      setState(prev => ({ ...prev, requesting: false }));
    }
  };

  const handleForm = async () => {
    setState(prev => ({ ...prev, requesting: true }));
    setMessage(null);

    try {
      const res = await auth.post('/verify', {code});
      if (res.data.success) {
        setMessage({ type: 'ok', msg: res.data.msg });
        setState({ verified: true, requesting: false });
        if(res.data.reset){
          navigate('/reset-password')
        }
      }
    } catch (error) {
      const {data,message} = error;
      setMessage({ type: 'err', msg: message });
      setState({ verified: false, requesting: false });
      if(data.redirect === 'login'){
          setRedirect(data.redirect);
      }
    }
  };

  const renderMessage = () => {
    if (!message) return null;

    const baseStyle = 'px-4 py-2 text-sm rounded-md my-2';
    const styles = {
      err: 'bg-red-200 text-red-800',
      ok: 'bg-green-200 text-green-800',
      default: 'bg-gray-200 text-gray-800',
    };

    return (
      <p className={`${baseStyle} ${styles[message.type] || styles.default}`}>
        {message.msg || 'Something happened'}
      </p>
    );
  };

  const renderRedirectMessage = (msg) => (
    <div className="bg-linear-[0deg,#d7dde4,transparent_50%] dark:bg-linear-[0deg,black,#2d2c2c] text-[var(---color-text)] w-full sm:w-[400px] p-4  mx-auto mt-4 sm:rounded-2xl"
      style={{boxShadow: '0 4px 8px 2px  var(---color-shadow)'}}>
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-3xl font-bold text-center">{msg && msg.h}</h2>
        {renderMessage()}
        <p className="text-sm text-center mt-2">
          {msg&&msg.msg}
        </p>
        <Link
          to="/login"
          className="mt-6 w-full px-1.5 py-2 rounded-lg bg-black text-white text-center block hover:bg-gray-900 transition"
        >
          Continue to Login
        </Link>
      </div>
    </div>
  );

  if (state.verified) return renderRedirectMessage({h:'Email Verified',msg:`You're verified! Click continue to log in.`});
  if(rediret) {return  renderRedirectMessage({h:'Invalid Request',msg:''})}
  return (
    <div className="bg-linear-[0deg,#d7dde4,transparent_50%] dark:bg-linear-[0deg,black,#2d2c2c] text-[var(---color-text)] w-full sm:w-[400px] p-4  mx-auto mt-[20%] sm:rounded-2xl">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-center">Verify Email</h2>
        <p className="text-sm text-center mt-2">         
            A verification code has been sent. Please enter it below.
        </p>

        {renderMessage()}

        <input
          className="bg-[var(---color-input-bg)] placeholder-[var(---color-placeholder)] border-[var(---color-input-border)] focus:border-[var(---color-input-b-focus)] w-full px-2 py-1 mt-4 border-b-2 disabled:cursor-not-allowed  outline-none transition"
          type="text"
          name="code"
          placeholder="Enter verification code"
          value={code}
          disabled={state.requesting}
          onChange={e => setCode(e.target.value)}
        />
        <div className="flex justify-end text-sm mt-1 text-[var(---color-text-light)]">
          {cooldown.current ?
            <span>wait for {counter}s to resend mail</span>
            :
             (state.requesting ? 
             <span className='text-sm text-gray-500'>Wait ...</span>
             :
             <button
              className="underline text-[var(---color-link)]  hover:text-[var(---color-link-hover)]"
              type="button"
              disabled={state.requesting}
              onClick={sendRequest}
            >
              Resend Email?
            </button>)
          }
        </div>
        <button
          className="mt-6 w-full px-2 py-2 rounded-lg bg-black text-white text-lg disabled:opacity-50 cursor-pointer"
          type="button"
          disabled={state.requesting}
          onClick={handleForm}
        >
          {state.requesting ? 'Verifying...' : 'Submit'}
        </button>

      </div>
    </div>
  );
};

export default Verify;
