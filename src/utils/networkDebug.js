/**
 * Network debugging utility for APK testing
 * Helps diagnose connection issues between the app and API server
 */
import { Platform } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'https://api.camorent.co.in';

/**
 * Test basic connectivity to the API server
 * @returns {Promise<Object>} Test results
 */
export const testAPIConnection = async () => {
  const results = {
    platform: Platform.OS,
    baseUrl: API_BASE_URL,
    tests: [],
  };

  // Test 1: Simple fetch to check if domain is reachable
  try {
    console.log('Testing basic connection to:', API_BASE_URL);
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    results.tests.push({
      name: 'Basic Fetch',
      success: true,
      status: response.status,
      message: `Server responded with status ${response.status}`,
    });
  } catch (error) {
    results.tests.push({
      name: 'Basic Fetch',
      success: false,
      error: error.message,
      message: 'Failed to connect to server',
    });
  }

  // Test 2: Axios GET request
  try {
    console.log('Testing axios GET request...');
    const response = await axios.get(API_BASE_URL, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      },
    });

    results.tests.push({
      name: 'Axios GET',
      success: true,
      status: response.status,
      message: 'Axios can connect to server',
    });
  } catch (error) {
    results.tests.push({
      name: 'Axios GET',
      success: false,
      error: error.message,
      code: error.code,
      message: `Axios error: ${error.message}`,
    });
  }

  // Test 3: Test login endpoint availability
  try {
    console.log('Testing login endpoint...');
    const response = await axios.post(`${API_BASE_URL}/admin/users/login`, {
      phone_number: 'test',
      password: 'test',
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: () => true, // Accept any status
    });

    results.tests.push({
      name: 'Login Endpoint',
      success: true,
      status: response.status,
      message: `Login endpoint responded (${response.status})`,
    });
  } catch (error) {
    results.tests.push({
      name: 'Login Endpoint',
      success: false,
      error: error.message,
      code: error.code,
      message: `Login endpoint error: ${error.message}`,
    });
  }

  console.log('Network debug results:', JSON.stringify(results, null, 2));
  return results;
};

/**
 * Get detailed device and network information
 * @returns {Object} Device info
 */
export const getDeviceInfo = () => {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
  };
};

/**
 * Test if the device can reach external URLs
 * @returns {Promise<boolean>}
 */
export const testInternetConnection = async () => {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    console.error('Internet connection test failed:', error.message);
    return false;
  }
};
