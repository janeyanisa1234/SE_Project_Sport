// utils/auth.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // You'll need to install this: npm install jwt-decode

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
        
        // Determine and set user role
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
        AuthService.setToken(response.data.token);
        AuthService.setUser(response.data.user);
        
        // Determine and set user role
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
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // Determine and set user role
  setUserRole: (user) => {
    let role = 'user'; // Default role
    
    if (user.isAdmin) {
      role = 'admin';
    } else if (user.isOwner) {
      role = 'owner';
    }
    
    localStorage.setItem('userRole', role);
  },
  
  // Get user role
  getUserRole: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole') || 'user';
    }
    return 'user';
  },

  // Logout user
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
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