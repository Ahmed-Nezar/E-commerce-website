import React, { useState, useEffect, useRef } from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import Footer from './components/Footer/Footer.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import SignIn from './components/Auth/SignIn.jsx'
import Register from './components/Auth/Register.jsx'
import ForgotPassword from './components/Auth/ForgotPassword.jsx'
import ResetPassword from './components/Auth/ResetPassword.jsx'
import ChangePassword from './components/Settings/ChangePassword.jsx'
import Cart from './components/Cart/Cart.jsx'
import Checkout from './components/checkout/Checkout.jsx'
import Home from './components/Home/Home.jsx'
import AdminDashboard from './components/Admin/AdminDashboard.jsx'
import AdminRoute from './components/Auth/AdminRoute.jsx'
import { CartProvider } from './context/CartContext.jsx'
export const ENV = import.meta.env;
import Products from "./components/Products/Products.jsx";
import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import {ToastContainer} from "react-toastify";
import {SearchProvider} from "./context/SearchContext.jsx";
import Settings from "./components/Settings/Settings.jsx";
import Profile from "./components/Settings/Profile.jsx";
import Logout from "./components/Settings/Logout.jsx";
import Orders from "./components/Settings/Orders.jsx";
import { OrderProvider } from './context/OrderContext.jsx'


// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/signin" />;
};

// Public Route component (redirects to home if logged in)
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return !token ? children : <Navigate to="/" />;
};

function App() {
    const navbarRef = useRef(null);
    const [offsetTop, setOffsetTop] = useState(0);

    useEffect(() => {
        if (navbarRef.current) {
            setOffsetTop(navbarRef.current.offsetHeight);
        }
    }, []);

    return (
        <SearchProvider>
            <CartProvider>
                <OrderProvider>
                <ToastContainer />
                <Router>
                    <Navbar reference={navbarRef}/>
                    <div className="position-relative" style={{ top: offsetTop }}>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route
                                path="/signin"
                                element={
                                    <PublicRoute>
                                        <SignIn/>
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    <PublicRoute>
                                        <Register/>
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/forgot-password"
                                element={
                                    <PublicRoute>
                                        <ForgotPassword/>
                                    </PublicRoute>
                                }
                            />
                            <Route
                                path="/reset-password/:token"
                                element={
                                    <PublicRoute>
                                        <ResetPassword/>
                                    </PublicRoute>
                                }
                            />
                            <Route path="/cart" element={<Cart/>}/>
                            <Route
                                path="/checkout"
                                element={
                                    <ProtectedRoute>
                                        <Checkout/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/products" element={<Products/>}/>
                            <Route path="/products/:cn" element={<Products/>}/>
                            <Route path="/productDetails/:id" element={<ProductDetails />}/>
                            <Route
                                path="/admin"
                                element={
                                    <AdminRoute>
                                        <AdminDashboard/>
                                    </AdminRoute>
                                }
                            />
                            <Route path="/me" element={
                                    <ProtectedRoute>
                                        <Settings/>
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="profile" element={<Profile/>}/>
                                <Route path="orders" element={<Orders/>}/>
                                <Route path="change-password" element={<ChangePassword/>}/>
                                <Route path="logout" element={<Logout/>}/>
                            </Route>
                        </Routes>
                    </div>
                    <Footer/>
                </Router>
                </OrderProvider>
            </CartProvider>
        </SearchProvider>
    )
}

export default App
