import React, { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './Layout.css'

const Layout = () => {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, user, logout, isPremium } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setShowLangMenu(false)
    setIsMobileMenuOpen(false)
  }

  const languages = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

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
                    {t('nav.dashboard')}
                  </Link>
                  <Link to="/workouts" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.workouts')}
                  </Link>
                  <Link to="/exercises" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.exercises')}
                  </Link>
                  <Link to="/progress" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.progress')}
                  </Link>
                  {!isPremium && (
                    <Link to="/premium" className="nav-link premium-link" onClick={() => setIsMobileMenuOpen(false)}>
                      {t('nav.goPremium')}
                    </Link>
                  )}
                  <div className="nav-user">
                    <span className="user-name">{user?.name}</span>
                    <Link to="/profile" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      {t('nav.profile')}
                    </Link>
                    <button onClick={handleLogout} className="btn btn-sm btn-outline">
                      {t('nav.logout')}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.login')}
                  </Link>
                  <Link to="/register" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.getStarted')}
                  </Link>
                </>
              )}

              {/* Dark Mode Toggle */}
              <button 
                className="theme-toggle" 
                onClick={toggleDarkMode}
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>

              {/* Language Selector */}
              <div className="language-selector">
                <button 
                  className="lang-button" 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  aria-label="Select language"
                >
                  <span className="lang-flag">{currentLanguage.flag}</span>
                  <span className="lang-code">{currentLanguage.code.toUpperCase()}</span>
                </button>
                {showLangMenu && (
                  <div className="lang-menu">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        className={`lang-option ${i18n.language === lang.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}
                      >
                        <span className="lang-flag">{lang.flag}</span>
                        <span className="lang-name">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
              <p>{t('footer.tagline')}</p>
            </div>
            <div className="footer-section">
              <h4>{t('footer.quickLinks')}</h4>
              <Link to="/exercises">{t('nav.exercises')}</Link>
              <Link to="/workouts">{t('nav.workouts')}</Link>
              <Link to="/premium">{t('nav.premium')}</Link>
            </div>
            <div className="footer-section">
              <h4>{t('footer.support')}</h4>
              <a href="#help">{t('footer.helpCenter')}</a>
              <a href="#contact">{t('footer.contactUs')}</a>
              <a href="#privacy">{t('footer.privacyPolicy')}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 MyWorkout. {t('footer.allRightsReserved')}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
