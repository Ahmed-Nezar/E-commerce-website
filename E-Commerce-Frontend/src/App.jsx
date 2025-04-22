import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer/Footer.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import SignIn from './components/Auth/SignIn.jsx'
import Register from './components/Auth/Register.jsx'
import ForgotPassword from './components/Auth/ForgotPassword.jsx'
import Cart from './components/Cart/Cart.jsx'
import Home from './components/Home/Home.jsx'
import { CartProvider } from './context/CartContext.jsx'
const ENV = import.meta.env;
import Products from "./components/Products/Products.jsx";

function App() {
    const navbarRef = useRef(null);
    const [offsetTop, setOffsetTop] = useState(0);

    useEffect(() => {
        if (navbarRef.current) {
            setOffsetTop(navbarRef.current.offsetHeight);
        }
    }, []);

    return (
        <CartProvider>
            <Router>
                <Navbar reference={navbarRef}/>
                <div style={{ paddingTop: offsetTop }}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/signin" element={<SignIn/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/forgot-password" element={<ForgotPassword/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/products" element={<Products/>}/>
                    </Routes>
                </div>
                <Footer/>
            </Router>
        </CartProvider>
    )
}

export default App
