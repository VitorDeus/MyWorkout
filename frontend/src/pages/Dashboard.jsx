import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { calculateWorkoutCalories } from '../utils/calorieCalculator'
import './Dashboard.css'

const Dashboard = () => {
  const { t } = useTranslation()
  const { user, isPremium } = useAuth()
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    currentStreak: 0,
    totalExercises: 0,
    totalCaloriesBurned: 0
  })

  useEffect(() => {
    // Load user stats from localStorage
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]')
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const thisWeekWorkouts = savedWorkouts.filter(w => {
      const workoutDate = new Date(w.date)
      return workoutDate >= weekAgo
    })

    const userWeight = 70
    const totalCalories = savedWorkouts.reduce((sum, workout) => {
      return sum + calculateWorkoutCalories(workout.exercises || [], userWeight)
    }, 0)

    setStats({
      totalWorkouts: savedWorkouts.length,
      thisWeek: thisWeekWorkouts.length,
      currentStreak: calculateStreak(savedWorkouts),
      totalExercises: savedWorkouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0),
      totalCaloriesBurned: totalCalories
    })
  }, [])

  const calculateStreak = (workouts) => {
    if (!workouts.length) return 0
    
    const sortedDates = workouts
      .map(w => new Date(w.date).toDateString())
      .sort((a, b) => new Date(b) - new Date(a))
    
    let streak = 0
    let currentDate = new Date()
    
    for (let i = 0; i < sortedDates.length; i++) {
      const workoutDate = new Date(sortedDates[i])
      const dayDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24))
      
      if (dayDiff === streak) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const recentWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>{t('dashboard.welcomeBack')}, {user?.name}! 👋</h1>
            <p className="dashboard-subtitle">{t('dashboard.subtitle')}</p>
          </div>
          {!isPremium && (
            <Link to="/premium" className="btn btn-warning">
              {t('dashboard.upgradePremium')}
            </Link>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalWorkouts}</div>
              <div className="stat-label">{t('dashboard.stats.totalWorkouts')}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <div className="stat-value">{stats.thisWeek}</div>
              <div className="stat-label">{t('dashboard.stats.thisWeek')}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <div className="stat-value">{stats.currentStreak}</div>
              <div className="stat-label">{t('dashboard.stats.dayStreak')}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalExercises}</div>
              <div className="stat-label">{t('dashboard.stats.exercisesDone')}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalCaloriesBurned}</div>
              <div className="stat-label">{t('common.calories')} {t('common.burned')}</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>{t('dashboard.quickActions.title')}</h2>
            <div className="quick-actions">
              <Link to="/workouts" className="action-card">
                <div className="action-icon">🏋️</div>
                <h3>{t('dashboard.quickActions.startWorkout')}</h3>
                <p>{t('dashboard.quickActions.startWorkoutDesc')}</p>
              </Link>
              <Link to="/exercises" className="action-card">
                <div className="action-icon">📚</div>
                <h3>{t('dashboard.quickActions.browseExercises')}</h3>
                <p>{t('dashboard.quickActions.browseExercisesDesc')}</p>
              </Link>
              <Link to="/progress" className="action-card">
                <div className="action-icon">📈</div>
                <h3>{t('dashboard.quickActions.viewProgress')}</h3>
                <p>{t('dashboard.quickActions.viewProgressDesc')}</p>
              </Link>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>{t('dashboard.recentWorkouts.title')}</h2>
              <Link to="/workouts" className="view-all">{t('dashboard.recentWorkouts.viewAll')}</Link>
            </div>
            {recentWorkouts.length > 0 ? (
              <div className="recent-workouts">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="workout-item">
                    <div className="workout-info">
                      <h4>{workout.name}</h4>
                      <p className="workout-meta">
                        {new Date(workout.date).toLocaleDateString()} • {workout.exercises?.length || 0} {t('dashboard.recentWorkouts.exercises')}
                      </p>
                    </div>
                    <div className="workout-badge">{workout.duration || '45 min'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>{t('dashboard.recentWorkouts.noWorkouts')}</p>
                <Link to="/workouts" className="btn btn-primary">{t('dashboard.recentWorkouts.createWorkout')}</Link>
              </div>
            )}
          </div>

          {!isPremium && (
            <div className="dashboard-section premium-cta">
              <div className="premium-card">
                <h2>{t('dashboard.premiumCta.title')}</h2>
                <ul className="premium-features">
                  {t('dashboard.premiumCta.features', { returnObjects: true }).map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <Link to="/premium" className="btn btn-primary btn-lg">
                  {t('dashboard.premiumCta.button')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
