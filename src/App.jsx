import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login';
import Navbar from './components/Navbar';
import Inicio from './components/Inicio';
import Confirmaciones from './components/Confirmaciones'
import './App.css'


function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  return (
    <Router>
      <div className="app-container">
        {loggedIn && <Navbar />}
        <div className="main-content">
          <Routes>
            <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
            <Route path="/home" element={loggedIn ? <Inicio /> : <Navigate to="/" />} />
            <Route path="/confirmaciones" element={loggedIn ? <Confirmaciones /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
