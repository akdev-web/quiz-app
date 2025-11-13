import React, { useEffect, useState } from 'react'
import UserAvatar from './util/UserAvatar'
import useUserContext from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import { MdOutlineDashboard } from 'react-icons/md'
import { House } from 'lucide-react'

const Navbar = () => {
    const navigate = useNavigate();
    const {user,Logout} = useUserContext()
    const [showUserOpt,setShowuUserOpt] = useState(false);
    const [showTooltip,setShowTooltip] = useState(false);
    const overlayRef = React.useRef();

    useEffect(() => {
        if (!showUserOpt) return;
        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                setShowuUserOpt(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserOpt]);
  return (
    <nav className='sticky top-0 w-full py-2 px-4 flex justify-between items-center bg-[var(---color-nav-bg)] text-[var(---color-text)] 
                    transition-shadow duration-300 shadow-md dark:shadow-lg shadow-gray-200 dark:shadow-black'>
        <div className='w-8'> 
            <img src="/quizm.png" alt="logo" className='w-full'/>
        </div>
        <div className='flex items-center gap-4 justify-end'>
            {
                user && 
                <>
                    <div className='relative' >
                        <div className='cursor-pointer' onClick={()=>navigate('/dashboard')}
                            onMouseEnter={()=>setShowTooltip(true)}
                            onMouseLeave={()=>setShowTooltip(false)}
                            >
                            <MdOutlineDashboard size={28} />
                        </div>
                        {showTooltip && (
                            <div className='absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow z-10 whitespace-nowrap'>
                            Dashboard
                            </div>
                        )}
                    </div>
                    <div className='cursor-pointer' onClick={()=>navigate('/quiz')}>
                        <House  size={28}/>
                    </div>
                    <div onClick={() => setShowuUserOpt(prev=>!prev)}>
                        <UserAvatar  className='cursor-pointer' profile={user.profile} name={user.username} size={32}/>
                    </div>
                    <div
                        ref={overlayRef}
                        className={`flex flex-col gap-2.5 min-w-[350px] ${showUserOpt ? 'max-h-[400px] p-4 pointer-events-auto' : 'max-h-0 p-0 opacity-0 pointer-events-none'} overflow-hidden transition-all duration-300 absolute top-[60px] right-6 bg-[var(---color-bg)] rounded-md shadow-sm`}
                        aria-disabled={!showUserOpt}
                    >
                        <div className='flex gap-2.5 justify-start items-center cursor-pointer' onClick={()=> navigate('/user')}>
                            <UserAvatar profile={user.profile}  name={user.username} size={48}/>
                            <div className='flex flex-col justify-start'>
                                <h4 className='text-lg'>{user.username}</h4>
                                <span className='block text-sm text-gray-500'>view profile</span>
                            </div>
                        </div>
                        <div className=' border-t-gray-400 border-t-2 h-0 '></div>
                        <button disabled={!showUserOpt} onClick={Logout} 
                            className={`w-full bg-black text-white text-lg py-2 px-4 rounded-md cursor-pointer disabled:cursor-not-allowed`}>
                            Logout
                        </button>
                    </div>
                </>
            }
            
        </div>
    </nav>
  )
}

export default Navbar