import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import {Toaster} from "react-hot-toast"
import {AuthContext} from "../context/AuthContext"


const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div>
      <Toaster />
      {/* <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/profile' element={<ProfileUpdate />} />
      </Routes>  */}

      {/* ----------------------- */}

      <Routes>
        <Route path='/' element={authUser ? <Chat /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <ProfileUpdate /> : <Navigate to="/login" />} />

      </Routes> 

    </div>
  )
}

export default App
