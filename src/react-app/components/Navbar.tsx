// src/react-app/components/Navbar.tsx
import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="PyBankers Home">
          <div className="navbar__logo-icon">🤖</div>
          <div className="navbar__logo-text">
            Py<span>Bankers</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__nav">
          <NavLink to="/" end className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
            Blog
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}>
            Contact
          </NavLink>
          <Link to="/blog" className="navbar__cta">Start Building →</Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar__mobile-menu${menuOpen ? ' open' : ''}`} role="menu">
        <NavLink to="/" end onClick={() => setMenuOpen(false)} className={({ isActive }) => `navbar__mobile-link${isActive ? ' active' : ''}`}>Home</NavLink>
        <NavLink to="/blog" onClick={() => setMenuOpen(false)} className={({ isActive }) => `navbar__mobile-link${isActive ? ' active' : ''}`}>Blog</NavLink>
        <NavLink to="/about" onClick={() => setMenuOpen(false)} className={({ isActive }) => `navbar__mobile-link${isActive ? ' active' : ''}`}>About</NavLink>
        <NavLink to="/contact" onClick={() => setMenuOpen(false)} className={({ isActive }) => `navbar__mobile-link${isActive ? ' active' : ''}`}>Contact</NavLink>
      </div>
    </nav>
  );
}
