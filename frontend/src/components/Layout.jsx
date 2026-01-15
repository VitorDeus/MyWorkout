import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

const Layout = () => {
  const { isAuthenticated, user, logout, isPremium } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand">
              <span className="brand-icon">💪</span>
              <span className="brand-text">MyWorkout</span>
            </Link>

            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/workouts" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    Workouts
                  </Link>
                  <Link to="/exercises" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    Exercises
                  </Link>
                  <Link to="/progress" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    Progress
                  </Link>
                  {!isPremium && (
                    <Link to="/premium" className="nav-link premium-link" onClick={() => setIsMobileMenuOpen(false)}>
                      ⭐ Go Premium
                    </Link>
                  )}
                  <div className="nav-user">
                    <span className="user-name">{user?.name}</span>
                    <Link to="/profile" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="btn btn-sm btn-outline">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>MyWorkout</h4>
              <p>Your personal fitness companion</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/exercises">Exercises</Link>
              <Link to="/workouts">Workouts</Link>
              <Link to="/premium">Premium</Link>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <a href="#help">Help Center</a>
              <a href="#contact">Contact Us</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 MyWorkout. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
