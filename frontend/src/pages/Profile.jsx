import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

const Profile = () => {
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
            <h1>Profile Settings</h1>
            <p>Manage your account and preferences</p>
          </div>
          {!isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit Profile
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
                {isPremium && <span className="premium-badge">⭐ Premium Member</span>}
              </div>
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <div className="stat-value">
                  {JSON.parse(localStorage.getItem('workouts') || '[]').length}
                </div>
                <div className="stat-label">Workouts</div>
              </div>
              <div className="profile-stat">
                <div className="stat-value">
                  {Math.floor(Math.random() * 30) + 10}
                </div>
                <div className="stat-label">Days Active</div>
              </div>
              <div className="profile-stat">
                <div className="stat-value">
                  {Math.floor(Math.random() * 10)}
                </div>
                <div className="stat-label">Achievements</div>
              </div>
            </div>
          </div>

          <div className="profile-details">
            <h3>Personal Information</h3>
            <div className="details-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
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
                  <label className="form-label">Age</label>
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
                  <label className="form-label">Weight (kg)</label>
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
                  <label className="form-label">Height (cm)</label>
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
                <label className="form-label">Fitness Goal</label>
                <select
                  className="form-input"
                  value={profile.goal}
                  onChange={(e) => handleChange('goal', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="strength">Build Strength</option>
                  <option value="muscle">Gain Muscle</option>
                  <option value="weight-loss">Lose Weight</option>
                  <option value="endurance">Improve Endurance</option>
                  <option value="general">General Fitness</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select
                  className="form-input"
                  value={profile.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-preferences">
            <h3>Preferences</h3>
            <div className="preference-item">
              <div>
                <h4>Email Notifications</h4>
                <p>Receive workout reminders and updates</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <div>
                <h4>Weekly Reports</h4>
                <p>Get your weekly progress summary</p>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="preference-item">
              <div>
                <h4>Social Sharing</h4>
                <p>Allow others to see your achievements</p>
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
