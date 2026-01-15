import React, { useState, useEffect } from 'react'
import './Progress.css'

const Progress = () => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalWeight: 0,
    averageDuration: 0,
    favoriteExercise: 'N/A'
  })

  const [progressData, setProgressData] = useState([])

  useEffect(() => {
    loadProgressData()
  }, [])

  const loadProgressData = () => {
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]')
    
    // Calculate stats
    const totalWorkouts = workouts.length
    const totalWeight = workouts.reduce((sum, w) => sum + (w.totalWeight || 0), 0)
    const avgDuration = workouts.length > 0 
      ? workouts.reduce((sum, w) => sum + (parseInt(w.duration) || 45), 0) / workouts.length 
      : 0

    // Get favorite exercise (most common)
    const exerciseCounts = {}
    workouts.forEach(w => {
      w.exercises?.forEach(e => {
        exerciseCounts[e.name] = (exerciseCounts[e.name] || 0) + 1
      })
    })
    
    const favoriteExercise = Object.keys(exerciseCounts).length > 0
      ? Object.entries(exerciseCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'N/A'

    setStats({
      totalWorkouts,
      totalWeight,
      averageDuration: Math.round(avgDuration),
      favoriteExercise
    })

    // Generate mock progress data for the last 30 days
    const days = 30
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Check if there's a workout on this day
      const hasWorkout = workouts.some(w => {
        const workoutDate = new Date(w.date)
        return workoutDate.toDateString() === date.toDateString()
      })
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        workouts: hasWorkout ? 1 : 0,
        active: hasWorkout
      })
    }
    
    setProgressData(data)
  }

  const achievements = [
    { icon: '🏆', title: 'First Workout', description: 'Completed your first workout', unlocked: stats.totalWorkouts > 0 },
    { icon: '🔥', title: '7 Day Streak', description: 'Worked out 7 days in a row', unlocked: false },
    { icon: '💪', title: '10 Workouts', description: 'Completed 10 total workouts', unlocked: stats.totalWorkouts >= 10 },
    { icon: '⭐', title: '50 Workouts', description: 'Reached 50 workouts milestone', unlocked: stats.totalWorkouts >= 50 },
    { icon: '🎯', title: 'Goal Setter', description: 'Set your first fitness goal', unlocked: false },
    { icon: '📈', title: 'Progress Tracker', description: 'Tracked progress for 30 days', unlocked: false }
  ]

  const weeklyGoal = (() => {
    const target = 5
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]')
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    weekStart.setHours(0, 0, 0, 0)
    
    const thisWeekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date)
      return workoutDate >= weekStart
    }).length
    
    return {
      target,
      current: Math.min(thisWeekWorkouts, target),
      percentage: Math.min((thisWeekWorkouts / target) * 100, 100)
    }
  })()

  return (
    <div className="progress-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Your Progress</h1>
            <p>Track your fitness journey and achievements</p>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-card-large">
            <div className="stat-icon-large">💪</div>
            <div className="stat-value-large">{stats.totalWorkouts}</div>
            <div className="stat-label-large">Total Workouts</div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon-large">⚡</div>
            <div className="stat-value-large">{stats.averageDuration}m</div>
            <div className="stat-label-large">Avg Duration</div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon-large">🎯</div>
            <div className="stat-value-large">{stats.totalWeight}kg</div>
            <div className="stat-label-large">Total Weight</div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon-large">⭐</div>
            <div className="stat-value-large">{stats.favoriteExercise}</div>
            <div className="stat-label-large">Top Exercise</div>
          </div>
        </div>

        <div className="progress-sections">
          <div className="progress-section">
            <h2>Weekly Goal</h2>
            <div className="goal-card">
              <div className="goal-header">
                <span>{weeklyGoal.current} / {weeklyGoal.target} workouts this week</span>
                <span className="goal-percentage">{Math.round(weeklyGoal.percentage)}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${weeklyGoal.percentage}%` }}
                ></div>
              </div>
              <p className="goal-message">
                {weeklyGoal.current >= weeklyGoal.target 
                  ? '🎉 Goal achieved! Keep it up!' 
                  : `${weeklyGoal.target - weeklyGoal.current} more workout${weeklyGoal.target - weeklyGoal.current !== 1 ? 's' : ''} to reach your goal`}
              </p>
            </div>
          </div>

          <div className="progress-section">
            <h2>Activity Calendar</h2>
            <div className="calendar-card">
              <div className="calendar-grid">
                {progressData.map((day, index) => (
                  <div 
                    key={index} 
                    className={`calendar-day ${day.active ? 'active' : ''}`}
                    title={`${day.date}: ${day.workouts} workout${day.workouts !== 1 ? 's' : ''}`}
                  >
                    <span className="day-label">{day.date}</span>
                  </div>
                ))}
              </div>
              <div className="calendar-legend">
                <span>Less</span>
                <div className="legend-boxes">
                  <div className="legend-box"></div>
                  <div className="legend-box active"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <h2>Achievements</h2>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                  {achievement.unlocked && <div className="unlocked-badge">✓ Unlocked</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress
