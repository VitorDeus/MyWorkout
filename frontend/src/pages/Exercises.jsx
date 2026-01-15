import React, { useState } from 'react'
import './Exercises.css'

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const exercises = [
    { id: 1, name: 'Barbell Squat', category: 'legs', difficulty: 'intermediate', equipment: 'Barbell', description: 'Compound lower body exercise targeting quads, glutes, and hamstrings' },
    { id: 2, name: 'Bench Press', category: 'chest', difficulty: 'intermediate', equipment: 'Barbell', description: 'Primary chest exercise for building upper body strength' },
    { id: 3, name: 'Deadlift', category: 'back', difficulty: 'advanced', equipment: 'Barbell', description: 'Full body compound movement focusing on posterior chain' },
    { id: 4, name: 'Pull-ups', category: 'back', difficulty: 'intermediate', equipment: 'Pull-up Bar', description: 'Bodyweight exercise for back and bicep development' },
    { id: 5, name: 'Overhead Press', category: 'shoulders', difficulty: 'intermediate', equipment: 'Barbell', description: 'Primary shoulder and tricep strengthening movement' },
    { id: 6, name: 'Bicep Curls', category: 'arms', difficulty: 'beginner', equipment: 'Dumbbells', description: 'Isolation exercise for bicep development' },
    { id: 7, name: 'Tricep Dips', category: 'arms', difficulty: 'intermediate', equipment: 'Parallel Bars', description: 'Compound exercise targeting triceps and chest' },
    { id: 8, name: 'Lunges', category: 'legs', difficulty: 'beginner', equipment: 'Bodyweight', description: 'Unilateral leg exercise for balance and strength' },
    { id: 9, name: 'Plank', category: 'core', difficulty: 'beginner', equipment: 'Bodyweight', description: 'Isometric core strengthening exercise' },
    { id: 10, name: 'Russian Twists', category: 'core', difficulty: 'intermediate', equipment: 'Medicine Ball', description: 'Rotational core exercise for obliques' },
    { id: 11, name: 'Lat Pulldown', category: 'back', difficulty: 'beginner', equipment: 'Cable Machine', description: 'Machine-based back width builder' },
    { id: 12, name: 'Leg Press', category: 'legs', difficulty: 'beginner', equipment: 'Leg Press Machine', description: 'Machine-based compound leg exercise' },
    { id: 13, name: 'Dumbbell Fly', category: 'chest', difficulty: 'beginner', equipment: 'Dumbbells', description: 'Isolation exercise for chest development' },
    { id: 14, name: 'Face Pulls', category: 'shoulders', difficulty: 'beginner', equipment: 'Cable Machine', description: 'Rear delt and upper back exercise' },
    { id: 15, name: 'Leg Raises', category: 'core', difficulty: 'intermediate', equipment: 'Bodyweight', description: 'Lower abdominal focused exercise' },
    { id: 16, name: 'Burpees', category: 'cardio', difficulty: 'intermediate', equipment: 'Bodyweight', description: 'Full body cardio and strength exercise' },
    { id: 17, name: 'Mountain Climbers', category: 'cardio', difficulty: 'beginner', equipment: 'Bodyweight', description: 'Dynamic cardio and core exercise' },
    { id: 18, name: 'Box Jumps', category: 'cardio', difficulty: 'intermediate', equipment: 'Plyo Box', description: 'Explosive lower body power exercise' }
  ]

  const categories = ['all', 'chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio']

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || exercise.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'beginner': return '#10b981'
      case 'intermediate': return '#f59e0b'
      case 'advanced': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="exercises-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Exercise Library</h1>
            <p>Browse our comprehensive collection of exercises</p>
          </div>
        </div>

        <div className="exercises-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
                onClick={() => setFilterCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="exercises-count">
          Showing {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
        </div>

        <div className="exercises-grid">
          {filteredExercises.map(exercise => (
            <div key={exercise.id} className="exercise-card">
              <div className="exercise-header">
                <h3>{exercise.name}</h3>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(exercise.difficulty) }}
                >
                  {exercise.difficulty}
                </span>
              </div>
              <div className="exercise-meta">
                <span className="exercise-category">
                  📁 {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                </span>
                <span className="exercise-equipment">
                  🏋️ {exercise.equipment}
                </span>
              </div>
              <p className="exercise-description">{exercise.description}</p>
              <button className="btn btn-outline btn-full">
                Add to Workout
              </button>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="empty-state">
            <p>No exercises found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Exercises
