
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RequestReset from './pages/auth/RequestReset'
import Verify from './pages/auth/Verify'
import Reset from './pages/auth/reset-pass'
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import Profile from './pages/user/Profile';
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFound';
import CreateQuiz from './pages/quiz/CrateQuiz';
import Quiz from './pages/quiz/Quiz';
import Participate from './pages/quiz/participate';
import Result from './pages/quiz/Result';
import Dashboard from './pages/user/Dashboard';
import DashboardResult from './pages/quiz/DashboardResult';




function App() {

  return (
    <>
      <ToastContainer/>
      <BrowserRouter>
          <Routes >
            <Route path='/user' element={<Layout />}>
                <Route index element={<Profile />} />
            </Route>
            <Route path='/quiz' element={<Layout />}>
                <Route index element={<Quiz />} />
                <Route path='create' element={<CreateQuiz />}></Route>
                <Route path='create/:id' element={<CreateQuiz />}> </Route>
                <Route path='participate/:id' element={<Participate />}></Route>
                <Route path='result/:id' element={<Result />}></Route>
            </Route>
            <Route path='/dashboard' element={<Layout />}>
                <Route index element={<Dashboard />}></Route>
                <Route path=':id' element={<DashboardResult />}></Route>
            </Route>
            <Route path='/' element={<AuthLayout />}>
                <Route index element={<Login/>} />
                <Route path='register' element={<Register />} />
                <Route path='login' element={<Login />} />
                <Route path='verify' element={<Verify />} />
                <Route path='request-reset' element={<RequestReset />} />
                <Route path='reset-password' element={<Reset />} />
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
