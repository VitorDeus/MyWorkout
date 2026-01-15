import React, { createContext, useState, useContext, useEffect } from 'react'

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
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user')
    const storedPremium = localStorage.getItem('isPremium')
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setIsPremium(storedPremium === 'true')
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // In a real app, this would call an API
    // For now, simulate a successful login
    const userData = {
      id: Date.now(),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    }
    
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return { success: true, user: userData }
  }

  const register = async (email, password, name) => {
    // In a real app, this would call an API
    const userData = {
      id: Date.now(),
      email,
      name,
      createdAt: new Date().toISOString()
    }
    
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return { success: true, user: userData }
  }

  const logout = () => {
    setUser(null)
    setIsPremium(false)
    localStorage.removeItem('user')
    localStorage.removeItem('isPremium')
  }

  const upgradeToPremium = () => {
    setIsPremium(true)
    localStorage.setItem('isPremium', 'true')
  }

  const value = {
    user,
    loading,
    isPremium,
    login,
    register,
    logout,
    upgradeToPremium,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
