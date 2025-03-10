import React from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Login, Signup, TeamManagement } from './components'

function App() {

  return (
   <Router>
    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/dashboard" element={<TeamManagement />}/>
    </Routes>
   </Router>

  )
}

export default App
