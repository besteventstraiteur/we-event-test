// API Configuration
// This file manages the API endpoints for the application

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Base URLs
export const API_CONFIG = {
  // Backend API URL
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  
  // WebSocket URL
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    ME: '/api/auth/me',
    UPDATE_PROFILE: '/api/auth/profile',
  },
  
  // Users
  USERS: {
    LIST: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },
  
  // Events
  EVENTS: {
    LIST: '/api/events',
    CREATE: '/api/events',
    GET: (id: string) => `/api/events/${id}`,
    UPDATE: (id: string) => `/api/events/${id}`,
    DELETE: (id: string) => `/api/events/${id}`,
  },
  
  // Packages
  PACKAGES: {
    LIST: '/api/packages',
    CREATE: '/api/packages',
    GET: (id: string) => `/api/packages/${id}`,
    UPDATE: (id: string) => `/api/packages/${id}`,
    DELETE: (id: string) => `/api/packages/${id}`,
    BY_PROVIDER: (businessId: string) => `/api/packages/provider/${businessId}`,
  },
  
  // Bookings
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    GET: (id: string) => `/api/bookings/${id}`,
    UPDATE_STATUS: (id: string) => `/api/bookings/${id}/status`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
  },
  
  // Ratings
  RATINGS: {
    LIST: '/api/ratings',
    CREATE: '/api/ratings',
    GET: (id: string) => `/api/ratings/${id}`,
    BY_BUSINESS: (businessId: string) => `/api/ratings/business/${businessId}`,
  },
  
  // Messages
  MESSAGES: {
    CONVERSATIONS: '/api/messages/conversations',
    GET_CONVERSATION: (id: string) => `/api/messages/conversations/${id}`,
    SEND: '/api/messages/send',
    MARK_READ: (id: string) => `/api/messages/${id}/read`,
  },
  
  // Photos
  PHOTOS: {
    LIST: '/api/photos',
    UPLOAD: '/api/photos/upload',
    GET: (id: string) => `/api/photos/${id}`,
    DELETE: (id: string) => `/api/photos/${id}`,
    BY_BUSINESS: (businessId: string) => `/api/photos/business/${businessId}`,
  },
  
  // Videos
  VIDEOS: {
    LIST: '/api/videos',
    CREATE: '/api/videos',
    GET: (id: string) => `/api/videos/${id}`,
    DELETE: (id: string) => `/api/videos/${id}`,
    BY_BUSINESS: (businessId: string) => `/api/videos/business/${businessId}`,
  },
  
  // Analytics
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    REVENUE: '/api/analytics/revenue',
    BOOKINGS: '/api/analytics/bookings',
    PACKAGES: '/api/analytics/packages',
  },
  
  // Business
  BUSINESS: {
    LIST: '/api/business',
    GET: (id: string) => `/api/business/${id}`,
    UPDATE: (id: string) => `/api/business/${id}`,
    SERVICES: (id: string) => `/api/business/${id}/services`,
  },
  
  // Categories
  CATEGORIES: {
    LIST: '/api/categories',
    GET: (id: string) => `/api/categories/${id}`,
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get headers
export const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Development mode indicator
export const IS_DEV = isDevelopment;
export const IS_PROD = isProduction;

// Feature flags
export const FEATURES = {
  USE_MOCK_DATA: !IS_PROD, // Use mock data in development
  ENABLE_WEBSOCKET: true,
  ENABLE_FILE_UPLOAD: false, // Not yet implemented
  ENABLE_EMAIL_NOTIFICATIONS: false, // Not yet implemented
};

console.log('🔧 API Configuration:', {
  baseUrl: API_CONFIG.BASE_URL,
  wsUrl: API_CONFIG.WS_URL,
  environment: IS_DEV ? 'development' : 'production',
  features: FEATURES,
});
