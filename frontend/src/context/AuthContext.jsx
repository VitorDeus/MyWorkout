import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    // Check for stored token and user data on mount
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsPremium(userData.is_premium || false)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.auth.login({ email, password })
      
      // Store token and user data
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setUser(response.user)
      setIsPremium(response.user.is_premium || false)
      
      return { success: true, user: response.user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const register = async (email, password, name) => {
    try {
      const response = await api.auth.register({ email, password, name })
      
      // Store token and user data
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      setUser(response.user)
      setIsPremium(false)
      
      return { success: true, user: response.user }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setIsPremium(false)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('isPremium')
  }

  const upgradeToPremium = () => {
    // In production, this would trigger Stripe payment flow
    // For now, simulate upgrade
    setIsPremium(true)
    if (user) {
      const updatedUser = { ...user, is_premium: true }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
    localStorage.setItem('isPremium', 'true')
  }

  const refreshUserData = async () => {
    try {
      const profileData = await api.users.getProfile()
      setUser(profileData.user)
      setIsPremium(profileData.user.is_premium || false)
      localStorage.setItem('user', JSON.stringify(profileData.user))
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  const value = {
    user,
    loading,
    isPremium,
    login,
    register,
    logout,
    upgradeToPremium,
    refreshUserData,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
