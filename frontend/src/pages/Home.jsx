import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const Home = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {t('home.title')}<br />
              <span className="gradient-text">{t('home.titleHighlight')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('home.subtitle')}
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    {t('home.startTrial')}
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    {t('home.signIn')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">{t('home.whyChoose')}</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>{t('home.features.trackProgress.title')}</h3>
              <p>{t('home.features.trackProgress.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💪</div>
              <h3>{t('home.features.customWorkouts.title')}</h3>
              <p>{t('home.features.customWorkouts.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>{t('home.features.mobileReady.title')}</h3>
              <p>{t('home.features.mobileReady.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>{t('home.features.goalSetting.title')}</h3>
              <p>{t('home.features.goalSetting.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>{t('home.features.community.title')}</h3>
              <p>{t('home.features.community.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>{t('home.features.premiumPlans.title')}</h3>
              <p>{t('home.features.premiumPlans.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">{t('home.stats.activeUsers')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">{t('home.stats.workoutPrograms')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">{t('home.stats.workoutsLogged')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9★</div>
              <div className="stat-label">{t('home.stats.userRating')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>{t('home.cta.title')}</h2>
            <p>{t('home.cta.subtitle')}</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-lg">
                {t('home.cta.button')}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
