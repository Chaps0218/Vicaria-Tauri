import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './UserContext'; // Importa el contexto y el hook
import Login from './components/Login';
import Navbar from './components/Navbar';
import Inicio from './components/Inicio';
import Confirmaciones from './components/Confirmaciones';
import Establecimientos from './components/Establecimientos';
import Ciudades from './components/Ciudades';
import Ministro from './components/Ministro';
import Parroquia from './components/Parroquia';
import './App.css';

function App() {
  const { loggedIn, handleLogin, handleLogout } = useUser();

  return (
    <Router>
      <div className="app-container">
        {loggedIn && <Navbar onLogout={handleLogout} />}
        <div className="main-content">
          <Routes>
            <Route path="/" element={loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
            <Route path="/home" element={loggedIn ? <Inicio /> : <Navigate to="/" />} />
            <Route path="/confirmaciones" element={loggedIn ? <Confirmaciones /> : <Navigate to="/" />} />
            <Route path="/establecimientos" element={loggedIn ? <Establecimientos /> : <Navigate to="/" />} />
            <Route path="/ciudades" element={loggedIn ? <Ciudades /> : <Navigate to="/" />} />
            <Route path="/ministros" element={loggedIn ? <Ministro /> : <Navigate to="/" />} />
            <Route path="/parroquias" element={loggedIn ? <Parroquia /> : <Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default function RootApp() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}
