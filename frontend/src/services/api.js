const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint (e.g., '/species', '/species/1')
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>} Parsed JSON response from API
 * @throws {Error} If request fails or response is not ok
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // Parse response body for error message
    const responseData = await response.json();

    // If status is not ok, throw error with backend message
    if (!response.ok) {
      const errorMessage = responseData?.message || `HTTP ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = responseData?.error;
      throw error;
    }

    return responseData;
  } catch (error) {
    // Log for debugging (remove in production)
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

/**
 * API Client with HTTP verb methods
 * Usage: apiClient.get('/species'), apiClient.post('/species', {data})
 */
export const apiClient = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<object>}
   */
  get: (endpoint, options = {}) =>
    fetchAPI(endpoint, {
      ...options,
      method: 'GET',
    }),

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body (will be JSON stringified)
   * @param {object} options - Fetch options
   * @returns {Promise<object>}
   */
  post: (endpoint, body, options = {}) =>
    fetchAPI(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} body - Request body (will be JSON stringified)
   * @param {object} options - Fetch options
   * @returns {Promise<object>}
   */
  put: (endpoint, body, options = {}) =>
    fetchAPI(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<object>}
   */
  delete: (endpoint, options = {}) =>
    fetchAPI(endpoint, {
      ...options,
      method: 'DELETE',
    }),
};
