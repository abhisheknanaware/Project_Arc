import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="logo">
        <span className="material-symbols-outlined">public</span>
        Project <span>ARC</span>
      </Link>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
        <NavLink to="/aboutus" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>About Us</NavLink>
        <NavLink to="/contactus" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Contact Us</NavLink>
      </div>
      <div>
        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
