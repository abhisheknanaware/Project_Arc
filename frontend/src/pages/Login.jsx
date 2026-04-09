import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus('Logging in...');
      const res = await axios.post('/api/login', formData);
      if(res.data.success) {
        setStatus('Logged in successfuly! Data captured.');
        setFormData({ username: '', password: '' });
      } else {
        setStatus('Failed to login.');
      }
    } catch (err) {
      console.error(err);
      setStatus('An error occurred during login.');
    }
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-card glass-panel">
        <div className="login-header">
           <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--accent-color)' }}>lock_open</span>
           <h2>Welcome Back</h2>
           <p>Log in to access your dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Username</label>
            <div className="input-with-icon">
              <span className="material-symbols-outlined icon">person</span>
              <input type="text" name="username" className="input-field" placeholder="Enter username" value={formData.username} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-with-icon">
              <span className="material-symbols-outlined icon">key</span>
              <input type="password" name="password" className="input-field" placeholder="Enter password" value={formData.password} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="login-options">
             <label className="remember-me">
                <input type="checkbox" /> Remember me
             </label>
             <a href="#forgot" className="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" className="btn-primary login-btn">Login to Account</button>
          
          {status && <p className="status-message text-center" style={{ marginTop: '1rem' }}>{status}</p>}
        </form>
        
        <div className="login-footer text-center">
            Don't have an account? <a href="#register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
