
import Navbar from './Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import useUserContext from '../context/UserContext'

const AuthLayout = () => {
  const { user, authenticating } = useUserContext()

  if (authenticating) {
    return (
      <div className='w-full min-h-screen h-full bg-[var(---color-body-bg)]'>
        <Navbar />
        <div className='flex flex-col items-center justify-center text-center  rounded-lg  p-8 mt-10'>
          <div className='mb-6'>
            <div className='w-12 h-12 border-4 border-gray-300 dark:border-gray-800 border-t-black dark:border-t-white rounded-full animate-spin mx-auto'></div>
          </div>

          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>
            Logging in...
          </h2>
          <p className='text-sm text-[var(---color-text-xlight)]'>
            Please wait while we authenticate your account.
          </p>
        </div>
      </div>
    )
  }

  if (user) return <Navigate to='/quiz' replace={true} state={{ alert: { msg: 'logged in successfully', type: 'success' } }} />

  return (
    <div className='w-full min-h-screen h-full bg-[var(---color-body-bg)]'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default AuthLayout