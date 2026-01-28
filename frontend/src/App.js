import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components with explicit paths
import Dashboard from './components/Dashboard';
import Login from './components/login';
import Register from './components/register';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Debug: Check if components are valid
  if (!Login || typeof Login !== 'function') {
    console.error('Login component is invalid:', Login);
    return <div>Error: Login component not loaded correctly</div>;
  }

  if (!Register || typeof Register !== 'function') {
    console.error('Register component is invalid:', Register);
    return <div>Error: Register component not loaded correctly</div>;
  }

  if (!Dashboard || typeof Dashboard !== 'function') {
    console.error('Dashboard component is invalid:', Dashboard);
    return <div>Error: Dashboard component not loaded correctly</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register onLogin={handleLogin} />}
        />
        <Route
          path="/"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;