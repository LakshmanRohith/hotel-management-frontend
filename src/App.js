// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hotels from './components/Hotels';
import HotelDetails from './components/HotelDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import './App.css'; 

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserData();
        }
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/users/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data);
            setRole(response.data.role);
        } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('token');
            setUser(null);
            setRole(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
        window.location.href = '/';
    };

    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <Link to="/" className="nav-brand">🏨 Hotel App</Link>
                    <div className="nav-links">
                        <Link to="/">Hotels</Link>
                        {user ? (
                            <>
                                <Link to="/profile">Profile</Link>
                                {role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
                                <button onClick={handleLogout} className="logout-btn">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/signup">Signup</Link>
                            </>
                        )}
                    </div>
                </nav>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Hotels apiBaseUrl={API_BASE_URL} />} />
                        <Route path="/hotels/:id" element={<HotelDetails apiBaseUrl={API_BASE_URL} />} />
                        <Route path="/login" element={<Login apiBaseUrl={API_BASE_URL} onLogin={fetchUserData} />} />
                        <Route path="/signup" element={<Signup apiBaseUrl={API_BASE_URL} />} />
                        <Route path="/profile" element={<Profile apiBaseUrl={API_BASE_URL} />} />
                        <Route path="/admin" element={<AdminDashboard apiBaseUrl={API_BASE_URL} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;