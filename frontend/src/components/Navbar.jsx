import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="logo">
        {/* Project ARC — Air/Atmosphere SVG Logo */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#58a6ff"/>
              <stop offset="100%" stopColor="#00d2ff"/>
            </linearGradient>
            <linearGradient id="arcGrad2" x1="36" y1="0" x2="0" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#79c0ff" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#58a6ff" stopOpacity="0.3"/>
            </linearGradient>
          </defs>

          {/* Floating particles */}
          <circle cx="6"  cy="9"  r="1.5" fill="url(#arcGrad)" opacity="0.9">
            <animate attributeName="cy" values="9;6;9"   dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="30" cy="8"  r="1"   fill="#00d2ff" opacity="0.7">
            <animate attributeName="cy" values="8;11;8"  dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="18" cy="5"  r="1.2" fill="#79c0ff" opacity="0.8">
            <animate attributeName="cy" values="5;8;5"   dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="28" cy="28" r="1"   fill="url(#arcGrad)" opacity="0.5">
            <animate attributeName="cy" values="28;25;28" dur="3.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="8"  cy="26" r="1.3" fill="#58a6ff" opacity="0.6">
            <animate attributeName="cy" values="26;29;26" dur="2.8s" repeatCount="indefinite"/>
          </circle>

          {/* Air wave arcs — three nested arcs giving depth */}
          <path
            d="M4 22 Q10 12 18 16 Q26 20 32 12"
            stroke="url(#arcGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="1"
          />
          <path
            d="M4 26 Q11 17 19 21 Q27 25 32 17"
            stroke="url(#arcGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M4 30 Q12 22 20 26 Q28 30 32 22"
            stroke="url(#arcGrad2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
        </svg>
        Project <span>ARC</span>
      </Link>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
        <NavLink to="/aqi" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>AQI Explorer</NavLink>
        <NavLink to="/aboutus" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>About Us</NavLink>
        <NavLink to="/contactus" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Contact Us</NavLink>
      </div>
      <div className="auth-buttons">
        {token ? (
          <button onClick={handleLogout} className="btn btn-outline">Logout</button>
        ) : (
          <>
            <Link to="/login" className="btn btn-text" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
