
import Navbar from './Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import useUserContext from '../context/UserContext'

const AuthLayout = () => {
  const {user,authenticating} = useUserContext()

  if(authenticating)
    {
        return(
          <div className='w-full min-h-screen h-full bg-[var(---color-body-bg)]'>
            <Navbar />
            <div className='text-center max-w-[400px] mx-auto'>
              <h2 className='text-2xl text-black'>Loging in ...</h2>
              <p className='text-sm text-gray-300'>please wait ...</p>
            </div>
        </div>
        )
  }
  
  if(user) return <Navigate to='/quiz' replace={true} state={{alert:{msg:'logged in successfully',type:'success'}}} />

  return (
    <div className='w-full min-h-screen h-full bg-[var(---color-body-bg)]'>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default AuthLayout