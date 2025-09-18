
import React from 'react'
import { useTheme } from '../context/ThemeContext'

const Home = () => {
  const {theme,setTheme} = useTheme();
  return (
    <div className='bg-red-200 text-gray-900 dark:bg-red-950 dark:text-white'>Home
      <select name="theme" id="" value={theme} onChange={(e)=>{setTheme(e.target.value)}}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
      </select>
    </div>
  )
}

export default Home