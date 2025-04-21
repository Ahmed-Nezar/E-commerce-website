import { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer/Footer.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import SignIn from './components/Auth/SignIn.jsx'
import Register from './components/Auth/Register.jsx'
import ForgotPassword from './components/Auth/ForgotPassword.jsx'

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
            <Footer />
        </Router>
    )
}

export default App
