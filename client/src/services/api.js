import axios from 'axios';

// ==============================================================================
// API BASE URL CONFIGURATION
// ==============================================================================

const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim();
const normalizedApiBase = rawApiUrl.replace(/\/+$/, '').endsWith('/api')
  ? rawApiUrl.replace(/\/+$/, '')
  : `${rawApiUrl.replace(/\/+$/, '')}/api`;

// Log API configuration in development
if (import.meta.env.MODE === 'development') {
  console.log('🔧 API Configuration:');
  console.log(`   VITE_API_URL: ${import.meta.env.VITE_API_URL || 'not set'}`);
  console.log(`   Normalized Base: ${normalizedApiBase}`);
}

// ==============================================================================
// AXIOS INSTANCE
// ==============================================================================

const api = axios.create({
  baseURL: normalizedApiBase,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================================================================
// REQUEST INTERCEPTOR - Handle Token & Logging
// ==============================================================================

api.interceptors.request.use(
  (config) => {
    // Log outgoing request in development
    if (import.meta.env.MODE === 'development') {
      console.log(`📤 [${config.method.toUpperCase()}] ${config.url}`);
    }

    // Read token from localStorage
    const userInfoRaw = localStorage.getItem('userInfo');
    let token = null;

    if (userInfoRaw) {
      try {
        token = JSON.parse(userInfoRaw)?.token || null;
      } catch (err) {
        console.warn('⚠️  Failed to parse userInfo from localStorage:', err.message);
        token = null;
      }
    }

    // Fallback to legacy adminToken key
    if (!token) {
      token = localStorage.getItem('adminToken');
    }

    // Attach token to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (import.meta.env.MODE === 'development') {
        console.log('   ✅ Token attached to request');
      }
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error.message);
    return Promise.reject(error);
  }
);

// ==============================================================================
// RESPONSE INTERCEPTOR - Handle Errors & Logging
// ==============================================================================

api.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (import.meta.env.MODE === 'development') {
      console.log(`📥 Response [${response.status}] ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    const { response, config, message } = error;
    const timestamp = new Date().toISOString();

    if (response) {
      // Server responded with error status
      console.error(`❌ [${timestamp}] API Error [${response.status}] ${config.method.toUpperCase()} ${config.url}`);
      
      if (response.status === 401) {
        console.error('   → Unauthorized: Token expired or invalid');
        console.error('   → Clearing auth tokens and redirecting...');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');

        const isAdminPath = window.location.pathname.startsWith('/admin');
        if (!isAdminPath) {
          window.location.replace('/admin/login');
        }
      } else if (response.status === 403) {
        console.error('   → Forbidden: Access denied');
      } else if (response.status === 404) {
        console.error('   → Not Found: Endpoint does not exist');
      } else if (response.status === 500) {
        console.error('   → Server Error: Internal server error');
        if (response.data?.message) {
          console.error(`   → Details: ${response.data.message}`);
        }
      } else {
        console.error(`   → Error: ${response.data?.message || response.data?.error || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error(`❌ [${timestamp}] No Response from ${config.url}`);
      console.error('   → Check if backend is running');
      console.error('   → Check CORS configuration');
      console.error('   → Check network connectivity');
    } else {
      // Error in request setup
      console.error(`❌ [${timestamp}] Request Error: ${message}`);
    }

    return Promise.reject(error);
  }
);

export default api;
