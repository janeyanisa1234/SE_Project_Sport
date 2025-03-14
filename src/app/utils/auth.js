// utils/auth.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = "http://localhost:5000/api/kong";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include authorization token in requests
api.interceptors.request.use(
  (config) => {
    // Get token on each request to ensure it's the latest
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401 Unauthorized error, it might be because our token is expired
    if (error.response && error.response.status === 401) {
      // Logout user and redirect to login page
      AuthService.logout();
    }
    return Promise.reject(error);
  }
);

// Authentication service
export const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post(`${API_URL}/register`, userData);
      if (response.data.token) {
        AuthService.setToken(response.data.token);
        AuthService.setUser(response.data.user);
        AuthService.setUserRole(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post(`${API_URL}/login`, credentials);
      if (response.data.token) {
        // Store token
        AuthService.setToken(response.data.token);
        
        // Store user data
        AuthService.setUser(response.data.user);
        AuthService.setUserRole(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Set token to localStorage
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Get token from localStorage
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Set user data to localStorage
  setUser: (user) => {
    // Store the complete user object
    localStorage.setItem('user', JSON.stringify(user));
    
    // For convenience, also store individual fields
    if (user.id) localStorage.setItem('userId', user.id);
    if (user.name) localStorage.setItem('userName', user.name);
    if (user.email) localStorage.setItem('userEmail', user.email);
  },
  
  // Determine and set user role
  setUserRole: (user) => {
    let role = 'user'; // Default to regular user
    
    if (user.isAdmin) {
      role = 'admin';
    } else if (user.isOwner) {
      role = 'owner';
    }
    
    localStorage.setItem('userRole', role);
    
    // Also store the boolean flags directly
    localStorage.setItem('isAdmin', user.isAdmin || false);
    localStorage.setItem('isOwner', user.isOwner || false);
  },
  
  // Get user role
  getUserRole: () => {
    if (typeof window !== 'undefined') {
      // If not authenticated, return null instead of 'user'
      if (!AuthService.isAuthenticated()) {
        return null;
      }
      return localStorage.getItem('userRole') || 'user';
    }
    return null; // Return null for server-side rendering
  },

  // Add this method to your AuthService object
  updateUserName: (newName) => {
    if (typeof window !== 'undefined') {
      // Update the user object
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.name = newName;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Also update the individual name field
      localStorage.setItem('userName', newName);
    }
  },

  // Logout user
  logout: () => {
    if (typeof window !== 'undefined') {
      // Clear all user-related data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('isOwner');
      window.location.href = '/Login';
    }
  },

  // Get current user info
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = AuthService.getToken();
    if (!token) {
      return false;
    }
    
    // Check if token is expired
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // If token is expired, remove it and return false
      if (decoded.exp < currentTime) {
        AuthService.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      // If token can't be decoded, it's invalid
      AuthService.logout();
      return false;
    }
  },

  // Refresh user data from server
  refreshUserData: async () => {
    try {
      if (AuthService.isAuthenticated()) {
        const response = await api.get('/profile');
        if (response.data.user) {
          AuthService.setUser(response.data.user);
          AuthService.setUserRole(response.data.user);
          return response.data.user;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
};

// Export the API instance for other API calls
export default api;