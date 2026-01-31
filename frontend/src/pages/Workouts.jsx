import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './Workouts.css'

const Workouts = () => {
  const { t } = useTranslation()
  const [workouts, setWorkouts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    description: '',
    exercises: []
  })

  useEffect(() => {
    loadWorkouts()
  }, [])

  const loadWorkouts = () => {
    const saved = localStorage.getItem('workouts')
    if (saved) {
      setWorkouts(JSON.parse(saved))
    }
  }

  const saveWorkout = () => {
    if (!newWorkout.name) return

    const workout = {
      ...newWorkout,
      id: Date.now(),
      date: new Date().toISOString()
    }

    const updated = [...workouts, workout]
    setWorkouts(updated)
    localStorage.setItem('workouts', JSON.stringify(updated))
    setShowModal(false)
    setNewWorkout({ name: '', description: '', exercises: [] })
  }

  const deleteWorkout = (id) => {
    const updated = workouts.filter(w => w.id !== id)
    setWorkouts(updated)
    localStorage.setItem('workouts', JSON.stringify(updated))
  }

  const workoutTemplates = [
    { name: 'Full Body Strength', exercises: ['Squats', 'Bench Press', 'Deadlifts', 'Pull-ups'], duration: '60 min' },
    { name: 'Upper Body', exercises: ['Bench Press', 'Rows', 'Shoulder Press', 'Bicep Curls'], duration: '45 min' },
    { name: 'Lower Body', exercises: ['Squats', 'Lunges', 'Leg Press', 'Calf Raises'], duration: '45 min' },
    { name: 'HIIT Cardio', exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats', 'High Knees'], duration: '30 min' },
    { name: 'Core & Abs', exercises: ['Planks', 'Crunches', 'Russian Twists', 'Leg Raises'], duration: '30 min' },
    { name: 'Powerlifting', exercises: ['Heavy Squats', 'Bench Press', 'Deadlifts', 'Overhead Press'], duration: '75 min' }
  ]

  const useTemplate = (template) => {
    const workout = {
      name: template.name,
      description: `${template.exercises.join(', ')}`,
      exercises: template.exercises.map(e => ({ name: e, sets: 3, reps: 10 })),
      duration: template.duration,
      id: Date.now(),
      date: new Date().toISOString()
    }

    const updated = [...workouts, workout]
    setWorkouts(updated)
    localStorage.setItem('workouts', JSON.stringify(updated))
  }

  return (
    <div className="workouts-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>{t('workouts.title')}</h1>
            <p>{t('workouts.subtitle')}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            {t('workouts.createCustom')}
          </button>
        </div>

        <div className="workouts-section">
          <h2>{t('workouts.templates')}</h2>
          <p className="section-subtitle">{t('workouts.templatesSubtitle')}</p>
          <div className="templates-grid">
            {workoutTemplates.map((template, index) => (
              <div key={index} className="template-card">
                <h3>{template.name}</h3>
                <p className="template-duration">{template.duration}</p>
                <ul className="template-exercises">
                  {template.exercises.map((exercise, i) => (
                    <li key={i}>{exercise}</li>
                  ))}
                </ul>
                <button className="btn btn-outline btn-full" onClick={() => useTemplate(template)}>
                  {t('workouts.useTemplate')}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="workouts-section">
          <h2>{t('workouts.myCustom')}</h2>
          {workouts.length > 0 ? (
            <div className="workouts-grid">
              {workouts.map((workout) => (
                <div key={workout.id} className="workout-card">
                  <div className="workout-header">
                    <h3>{workout.name}</h3>
                    <button className="delete-btn" onClick={() => deleteWorkout(workout.id)}>
                      🗑️
                    </button>
                  </div>
                  <p className="workout-description">{workout.description}</p>
                  <div className="workout-footer">
                    <span className="workout-date">
                      {new Date(workout.date).toLocaleDateString()}
                    </span>
                    <span className="workout-exercises">
                      {workout.exercises?.length || 0} {t('exercises.exercises')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>{t('workouts.noCustomWorkouts')}</p>
            </div>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{t('workouts.createWorkoutTitle')}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('workouts.workoutName')}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Morning Routine"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('workouts.description')}</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Describe your workout..."
                    value={newWorkout.description}
                    onChange={(e) => setNewWorkout({...newWorkout, description: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                  {t('workouts.cancel')}
                </button>
                <button className="btn btn-primary" onClick={saveWorkout}>
                  {t('workouts.create')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Workouts
