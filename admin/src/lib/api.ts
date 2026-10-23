import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  withCredentials: true, // Crucial for sending/receiving httpOnly cookies
});

// Response interceptor to catch 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we receive a 401, it means the token is expired or invalid
    if (error.response) {
      if (error.response.status === 401) {
        // Only redirect to login if the auth session check (/api/v1/auth/me) returns 401
        const requestUrl = error.config?.url || '';
        if (typeof window !== 'undefined' && window.location.pathname !== '/login' && requestUrl.includes('/api/v1/auth/me')) {
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        // Handle 403 Forbidden
        if (typeof window !== 'undefined') {
          console.error('Action forbidden by RBAC.');
          // Optional: redirect to a generic 403 page or dashboard
          // window.location.href = '/dashboard';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
