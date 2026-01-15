import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Your Body,<br />
              <span className="gradient-text">Track Your Progress</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate fitness companion to help you achieve your goals.
              Track workouts, monitor progress, and stay motivated.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Start Free Trial
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose MyWorkout?</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Track Progress</h3>
              <p>Monitor your strength gains, weight loss, and body measurements over time with detailed charts and analytics.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💪</div>
              <h3>Custom Workouts</h3>
              <p>Create personalized workout routines tailored to your goals, or choose from hundreds of pre-made programs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Ready</h3>
              <p>Access your workouts anywhere, anytime. Works seamlessly on all your devices, even offline.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Goal Setting</h3>
              <p>Set realistic fitness goals and get AI-powered recommendations to help you achieve them faster.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Community</h3>
              <p>Join challenges, share progress, and stay motivated with a supportive fitness community.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔥</div>
              <h3>Premium Plans</h3>
              <p>Unlock advanced features, personalized coaching, and exclusive workout programs from expert trainers.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Workout Programs</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Workouts Logged</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.9★</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Fitness Journey?</h2>
            <p>Join thousands of users who are already achieving their fitness goals</p>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
