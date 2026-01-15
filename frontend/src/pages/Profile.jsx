import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

const Profile = () => {
  const { t } = useTranslation()
  const { user, isPremium } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: '',
    weight: '',
    height: '',
    goal: 'strength',
    experience: 'intermediate'
  })

  const handleSave = () => {
    // Save profile to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    setIsEditing(false)
  }

  const handleChange = (field, value) => {
    setProfile(prev => ({...prev, [field]: value}))
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>{t('profile.title')}</h1>
            <p>{t('profile.subtitle')}</p>
          </div>
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              {t('profile.editProfile')}
            </button>
          )}
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="profile-info">
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
                {isPremium && <span className="premium-badge">{t('profile.premiumMember')}</span>}
              </div>
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="stat-value">
                  {JSON.parse(localStorage.getItem('workouts') || '[]').length}
                </div>
                <div className="stat-label">{t('profile.workouts')}</div>
              </div>
              <div className="profile-stat">
                <div className="stat-value">
                  {(() => {
                    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]')
                    const uniqueDays = new Set(workouts.map(w => new Date(w.date).toDateString())).size
                    return uniqueDays
                  })()}
                </div>
                <div className="stat-label">{t('profile.daysActive')}</div>
              </div>
              <div className="profile-stat">
                <div className="stat-value">
                  {(() => {
                    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]')
                    let achievements = 0
                    if (workouts.length > 0) achievements++
                    if (workouts.length >= 10) achievements++
                    if (workouts.length >= 50) achievements++
                    return achievements
                  })()}
                </div>
                <div className="stat-label">{t('profile.achievements')}</div>
              </div>
            </div>
          </div>

          <div className="profile-details">
            <h3>{t('profile.personalInfo')}</h3>
            <div className="details-form">
              <div className="form-group">
                <label className="form-label">{t('profile.fullName')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile.email')}</label>
                <input
                  type="email"
                  className="form-input"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t('profile.age')}</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profile.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    disabled={!isEditing}
                    placeholder="25"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('profile.weight')}</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profile.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    disabled={!isEditing}
                    placeholder="70"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('profile.height')}</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profile.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    disabled={!isEditing}
                    placeholder="175"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile.fitnessGoal')}</label>
                <select
                  className="form-input"
                  value={profile.goal}
                  onChange={(e) => handleChange('goal', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="strength">{t('profile.goals.strength')}</option>
                  <option value="muscle">{t('profile.goals.muscle')}</option>
                  <option value="weight-loss">{t('profile.goals.weightLoss')}</option>
                  <option value="endurance">{t('profile.goals.endurance')}</option>
                  <option value="general">{t('profile.goals.general')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('profile.experienceLevel')}</label>
                <select
                  className="form-input"
                  value={profile.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="beginner">{t('profile.experience.beginner')}</option>
                  <option value="intermediate">{t('profile.experience.intermediate')}</option>
                  <option value="advanced">{t('profile.experience.advanced')}</option>
                </select>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                    {t('profile.cancel')}
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    {t('profile.saveChanges')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-preferences">
            <h3>{t('profile.preferences')}</h3>
            <div className="preference-item">
              <div>
                <h4>{t('profile.emailNotifications')}</h4>
                <p>{t('profile.emailNotificationsDesc')}</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <div>
                <h4>{t('profile.weeklyReports')}</h4>
                <p>{t('profile.weeklyReportsDesc')}</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <div>
                <h4>{t('profile.socialSharing')}</h4>
                <p>{t('profile.socialSharingDesc')}</p>
              </div>
              <label className="toggle">
                <input type="checkbox" />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
