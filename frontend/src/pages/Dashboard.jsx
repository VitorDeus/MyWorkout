import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const Dashboard = () => {
  const { user, isPremium } = useAuth()
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisWeek: 0,
    currentStreak: 0,
    totalExercises: 0
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

    setStats({
      totalWorkouts: savedWorkouts.length,
      thisWeek: thisWeekWorkouts.length,
      currentStreak: calculateStreak(savedWorkouts),
      totalExercises: savedWorkouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0)
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
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-subtitle">Here's your fitness overview</p>
          </div>
          {!isPremium && (
            <Link to="/premium" className="btn btn-warning">
              ⭐ Upgrade to Premium
            </Link>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalWorkouts}</div>
              <div className="stat-label">Total Workouts</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <div className="stat-value">{stats.thisWeek}</div>
              <div className="stat-label">This Week</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <div className="stat-value">{stats.currentStreak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalExercises}</div>
              <div className="stat-label">Exercises Done</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/workouts" className="action-card">
                <div className="action-icon">🏋️</div>
                <h3>Start Workout</h3>
                <p>Begin your training session</p>
              </Link>
              <Link to="/exercises" className="action-card">
                <div className="action-icon">📚</div>
                <h3>Browse Exercises</h3>
                <p>Explore exercise library</p>
              </Link>
              <Link to="/progress" className="action-card">
                <div className="action-icon">📈</div>
                <h3>View Progress</h3>
                <p>Track your improvements</p>
              </Link>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Workouts</h2>
              <Link to="/workouts" className="view-all">View All →</Link>
            </div>
            {recentWorkouts.length > 0 ? (
              <div className="recent-workouts">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="workout-item">
                    <div className="workout-info">
                      <h4>{workout.name}</h4>
                      <p className="workout-meta">
                        {new Date(workout.date).toLocaleDateString()} • {workout.exercises?.length || 0} exercises
                      </p>
                    </div>
                    <div className="workout-badge">{workout.duration || '45 min'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No workouts yet. Start your first workout today!</p>
                <Link to="/workouts" className="btn btn-primary">Create Workout</Link>
              </div>
            )}
          </div>

          {!isPremium && (
            <div className="dashboard-section premium-cta">
              <div className="premium-card">
                <h2>🌟 Unlock Premium Features</h2>
                <ul className="premium-features">
                  <li>✓ AI-powered workout recommendations</li>
                  <li>✓ Personalized training plans</li>
                  <li>✓ Advanced progress analytics</li>
                  <li>✓ Nutrition tracking</li>
                  <li>✓ Expert workout programs</li>
                </ul>
                <Link to="/premium" className="btn btn-primary btn-lg">
                  Go Premium Now
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
