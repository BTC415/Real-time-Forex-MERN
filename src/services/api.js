import { API_URL } from '../config/constants';

// Helper functions
const createHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

const handleResponse = async (response, action) => {
  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    let errorMessage;
    try {
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        errorMessage = error.message || `Failed to ${action}`;
      } else {
        errorMessage = `Failed to ${action}: ${response.statusText}`;
      }
    } catch (e) {
      errorMessage = `Failed to ${action}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

// API methods
export const api = {

  baseUrl: API_URL,

  async request(endpoint, options = {}) {
    const { token, ...customOptions } = options;

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...customOptions,
        headers: createHeaders(token)
      });

      return handleResponse(response, options.action || 'perform request');
    } catch (error) {
      logger.error(`API Request failed: ${error.message}`);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error;
    }
  },

  // Auth endpoints
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      action: 'login'
    });
  },

  async register(credentials) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
      action: 'register'
    });
  },

  async updateUser(userData, token) {
    return this.request('/api/auth/update', {
      method: 'PUT',
      body: JSON.stringify(userData),
      token,
      action: 'update user'
    });
  },

  async validateToken(token) {
    return this.request('/api/auth/validate', {
      token,
      action: 'validate token'
    });
  }
};