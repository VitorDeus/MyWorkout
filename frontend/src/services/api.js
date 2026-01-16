// API Service - Central place for all backend API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    // Handle errors
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
};

// API object with all endpoints
const api = {
  // ========== Authentication ==========
  auth: {
    register: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },

    login: async (credentials) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      return handleResponse(response);
    },
  },

  // ========== Workouts ==========
  workouts: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/api/workouts`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      return handleResponse(response);
    },

    getById: async (id) => {
      const response = await fetch(`${API_BASE_URL}/api/workouts/${id}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      return handleResponse(response);
    },

    create: async (workoutData) => {
      const response = await fetch(`${API_BASE_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(workoutData),
      });
      return handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${API_BASE_URL}/api/workouts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      return handleResponse(response);
    },

    getStats: async () => {
      const response = await fetch(`${API_BASE_URL}/api/workouts/stats/summary`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      return handleResponse(response);
    },
  },

  // ========== AI Coach ==========
  ai: {
    getAdvice: async (question) => {
      const response = await fetch(`${API_BASE_URL}/api/ai/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ question }),
      });
      return handleResponse(response);
    },

    getWeeklyPlan: async (preferences) => {
      const response = await fetch(`${API_BASE_URL}/api/ai/weekly-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(preferences),
      });
      return handleResponse(response);
    },

    getPerformanceAnalysis: async () => {
      const response = await fetch(`${API_BASE_URL}/api/ai/performance-analysis`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      return handleResponse(response);
    },

    simpleQuestion: async (question) => {
      const response = await fetch(`${API_BASE_URL}/api/ai/simple-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ question }),
      });
      return handleResponse(response);
    },

    comprehensiveAdvice: async (question) => {
      const response = await fetch(`${API_BASE_URL}/api/ai/comprehensive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({ question }),
      });
      return handleResponse(response);
    },
  },

  // ========== User Profile ==========
  users: {
    getProfile: async () => {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      return handleResponse(response);
    },

    updateProfile: async (profileData) => {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(profileData),
      });
      return handleResponse(response);
    },

    updatePreferences: async (preferences) => {
      const response = await fetch(`${API_BASE_URL}/api/users/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(preferences),
      });
      return handleResponse(response);
    },

    changePassword: async (passwordData) => {
      const response = await fetch(`${API_BASE_URL}/api/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(passwordData),
      });
      return handleResponse(response);
    },
  },

  // ========== Health Check ==========
  health: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },
};

export default api;
