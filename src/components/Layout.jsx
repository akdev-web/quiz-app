import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { Navigate, Outlet  } from 'react-router-dom'
import useUserContext from '../context/UserContext'

const Layout = () => {

  const {user,authenticating} = useUserContext()
  if(authenticating){
    return;
  } 
  if(!user) return <Navigate to='/login' replace={true} state={{alert:{msg:'You are logged out !',type:'err'}}} />


  return (
    <div className='w-full min-h-screen h-full bg-[var(---color-body-bg)] text-[var(---color-text)]  '>
        <Navbar />
        <div className='mt-6 w-full sm:p-4 '>
            <Outlet />
        </div>
    </div>
  )
}

export default Layout