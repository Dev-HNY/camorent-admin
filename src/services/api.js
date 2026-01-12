import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = 'https://api.camorent.co.in';

// Storage keys
const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

// Secure storage wrapper functions
const secureStorage = {
  async setItem(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails (e.g., on web)
      // Fallback to AsyncStorage
      await AsyncStorage.setItem(key, value);
    }
  },
  async getItem(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      // Fallback to AsyncStorage
      return await AsyncStorage.getItem(key);
    }
  },
  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      // Fallback to AsyncStorage if SecureStore fails
      // Fallback to AsyncStorage
      await AsyncStorage.removeItem(key);
    }
  },
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await secureStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      await secureStorage.removeItem(TOKEN_KEY);
      await secureStorage.removeItem(USER_KEY);
    }
    return Promise.reject(error);
  }
);

// ==================== Auth Services ====================

/**
 * Admin login
 * @param {string} phone_number - Admin phone number
 * @param {string} password - Admin password
 * @returns {Promise} Response with user data and tokens
 */
export const adminLogin = async (phone_number, password) => {
  try {
    const response = await api.post('/admin/users/login', {
      phone_number,
      password,
    });

    const { id_token, user } = response.data;

    // Store token and user data securely
    await secureStorage.setItem(TOKEN_KEY, id_token);
    await secureStorage.setItem(USER_KEY, JSON.stringify(user));

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error handling for production

    // Determine user-friendly error message
    let userMessage = 'Login failed. Please try again.';

    if (error.response) {
      // Server error
      userMessage = error.response?.data?.detail?.message ||
                   error.response?.data?.message ||
                   `Server error (${error.response.status})`;
    } else if (error.code === 'ECONNABORTED') {
      userMessage = 'Connection timeout. Please check your internet connection.';
    } else if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      userMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message.includes('timeout')) {
      userMessage = 'Connection timeout. Please check your internet connection.';
    }

    return {
      success: false,
      error: userMessage,
    };
  }
};

/**
 * Logout - Clear stored credentials
 */
export const adminLogout = async () => {
  try {
    await secureStorage.removeItem(TOKEN_KEY);
    await secureStorage.removeItem(USER_KEY);
    return { success: true };
  } catch (error) {
    // Logout error
    return { success: false, error: error.message };
  }
};

/**
 * Get current user from storage
 */
export const getCurrentUser = async () => {
  try {
    const userJson = await secureStorage.getItem(USER_KEY);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    // Error getting user
    return null;
  }
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = async () => {
  try {
    const token = await secureStorage.getItem(TOKEN_KEY);
    return !!token;
  } catch (error) {
    return false;
  }
};

// ==================== Booking Services ====================

/**
 * Get all bookings with filters
 * @param {object} params - Query parameters
 * @param {string} params.status - Filter by status
 * @param {string} params.times - Filter by time (upcoming, ongoing, done)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Response with bookings list
 */
export const getAllBookings = async (params = {}) => {
  try {
    const response = await api.get('/admin/bookings', { params });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error fetching bookings
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to fetch bookings',
    };
  }
};

/**
 * Get pending bookings (admin_review status)
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Response with pending bookings
 */
export const getPendingBookings = async (page = 1, limit = 50) => {
  try {
    const response = await api.get('/admin/bookings', {
      params: {
        status: 'admin_review',
        page,
        limit,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error fetching pending bookings
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to fetch pending bookings',
    };
  }
};

/**
 * Get draft bookings
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Response with draft bookings
 */
export const getDraftBookings = async (page = 1, limit = 50) => {
  try {
    const response = await api.get('/admin/bookings', {
      params: {
        status: 'draft',
        page,
        limit,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error fetching draft bookings
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to fetch draft bookings',
    };
  }
};

/**
 * Get ongoing bookings
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Response with ongoing bookings
 */
export const getOngoingBookings = async (page = 1, limit = 50) => {
  try {
    const response = await api.get('/admin/bookings', {
      params: {
        times: 'ongoing',
        page,
        limit,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error fetching ongoing bookings
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to fetch ongoing bookings',
    };
  }
};

/**
 * Get completed bookings
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Response with completed bookings
 */
export const getCompletedBookings = async (page = 1, limit = 50) => {
  try {
    const response = await api.get('/admin/bookings', {
      params: {
        times: 'done',
        page,
        limit,
      },
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error fetching completed bookings
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to fetch completed bookings',
    };
  }
};

/**
 * Get booking details by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Response with booking details
 */
export const getBookingDetails = async (bookingId) => {
  try {
    const response = await api.get(`/admin/bookings/${bookingId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error fetching booking details
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to fetch booking details',
    };
  }
};

/**
 * Approve a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Response
 */
export const approveBooking = async (bookingId) => {
  try {
    const response = await api.post(`/admin/bookings/${bookingId}/approve`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error approving booking
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to approve booking',
    };
  }
};

/**
 * Reject a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Response
 */
export const rejectBooking = async (bookingId) => {
  try {
    const response = await api.post(`/admin/bookings/${bookingId}/reject`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error rejecting booking
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to reject booking',
    };
  }
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 * @returns {Promise} Response
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await api.put(`/admin/bookings/${bookingId}/status`, { status });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error updating booking status
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to update booking status',
    };
  }
};

// ==================== Invoice Services ====================

/**
 * View invoice details for a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Response with invoice details
 */
export const viewInvoice = async (bookingId) => {
  try {
    const response = await api.get(`/admin/bookings/${bookingId}/invoice`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error viewing invoice
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to fetch invoice details',
    };
  }
};

/**
 * Send invoice to customer
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Response
 */
export const sendInvoice = async (bookingId) => {
  try {
    const response = await api.post(`/admin/bookings/${bookingId}/invoice/send`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error sending invoice
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to send invoice',
    };
  }
};

/**
 * Send payment reminder for invoice
 * @param {string} bookingId - Booking ID
 * @returns {Promise} Response
 */
export const sendInvoiceReminder = async (bookingId) => {
  try {
    const response = await api.post(`/admin/bookings/${bookingId}/invoice/remind`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error sending reminder
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to send reminder',
    };
  }
};

// ==================== User Services ====================

/**
 * Get user details by ID
 * @param {string} userId - User ID
 * @returns {Promise} Response with user details
 */
export const getUserDetails = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error fetching user details
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to fetch user details',
    };
  }
};

// ==================== Push Notification Services ====================

/**
 * Update device token for push notifications
 * @param {string} deviceToken - FCM device token
 * @returns {Promise} Response
 */
export const updateDeviceToken = async (deviceToken) => {
  try {
    const response = await api.post('/admin/users/device-token', {
      device_token: deviceToken,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    // Error updating device token
    return {
      success: false,
      error: error.response?.data?.detail?.message || 'Failed to update device token',
    };
  }
};

// Export API instance for custom requests
export default api;
