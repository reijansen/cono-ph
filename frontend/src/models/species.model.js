/**
 * Species Data Model
 * Defines the data contract with backend API
 * All species data must conform to this structure
 */

/**
 * Default species object structure
 * @typedef {Object} Species
 * @property {number} id - Unique identifier
 * @property {string} scientific_name - Scientific name (e.g., "Conus geographus")
 * @property {string} common_name - Common name (e.g., "Geography cone")
 * @property {number} num_related_publications - Number of related publications
 * @property {string} created_at - ISO 8601 timestamp
 * @property {string} updated_at - ISO 8601 timestamp
 */
export const SpeciesModel = {
  id: 0,
  scientific_name: '',
  common_name: '',
  num_related_publications: 0,
  created_at: '',
  updated_at: '',
};

/**
 * Filter model for species list queries
 * @typedef {Object} SpeciesFilter
 * @property {number} [page=1] - Page number for pagination
 * @property {number} [limit=10] - Items per page
 * @property {string} [search=''] - Search term for species name
 * @property {string} [sortBy='created_at'] - Field to sort by
 * @property {string} [order='DESC'] - Sort order (ASC or DESC)
 */
export const SpeciesFilterModel = {
  page: 1,
  limit: 10,
  search: '',
  sortBy: 'created_at',
  order: 'DESC',
};

/**
 * Pagination metadata returned with list responses
 * @typedef {Object} Pagination
 * @property {number} page - Current page
 * @property {number} limit - Items per page
 * @property {number} total - Total items count
 * @property {number} totalPages - Total number of pages
 */
export const PaginationModel = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

/**
 * API Response wrapper for success responses
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether request was successful
 * @property {any} data - Response data (species object or array)
 * @property {string} message - Human-readable message
 * @property {Pagination} [pagination] - Pagination metadata (for list endpoints)
 */
export const ApiResponseModel = {
  success: true,
  data: null,
  message: '',
  pagination: null,
};

/**
 * API Response wrapper for error responses
 * @typedef {Object} ApiErrorResponse
 * @property {boolean} success - Always false
 * @property {null} data - Always null
 * @property {string} message - Error message
 * @property {string} [error] - Error code for debugging
 */
export const ApiErrorResponseModel = {
  success: false,
  data: null,
  message: '',
  error: '',
};
