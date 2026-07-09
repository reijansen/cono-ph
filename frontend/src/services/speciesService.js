import { apiClient } from './api.js';

/**
 * Species Service object
 * All methods are async and throw errors on failure
 * Caller should handle errors with try/catch
 */
export const speciesService = {
  /**
   * Fetch all species with optional filters
   * 
   * @param {object} filters - Query filters
   * @param {number} [filters.page=1] - Page number
   * @param {number} [filters.limit=10] - Items per page
   * @param {string} [filters.search=''] - Search term
   * @param {string} [filters.sortBy='created_at'] - Sort field
   * @param {string} [filters.order='DESC'] - Sort order
   * 
   * @returns {Promise<object>} - { success, data: [...], message, pagination }
   * @throws {Error} - If API call fails
   * 
   * @example
   * const result = await speciesService.getAllSpecies({ page: 1, limit: 10 });
   * console.log(result.data); // Array of species
   * console.log(result.pagination); // { page, limit, total, totalPages }
   */
  async getAllSpecies(filters = {}) {
    // Build query string from filters
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);

    // Build endpoint with query string
    const queryString = params.toString();
    const endpoint = queryString ? `/species?${queryString}` : '/species';

    // Make API call
    const response = await apiClient.get(endpoint);

    // Validate response format
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch species');
    }

    return response;
  },

  /**
   * Fetch single species by ID
   * 
   * @param {number} id - Species ID
   * @returns {Promise<object>} - { success, data: {...}, message }
   * @throws {Error} - If species not found or API fails
   * 
   * @example
   * const result = await speciesService.getSpeciesById(1);
   * console.log(result.data); // { id, scientific_name, ... }
   */
  async getSpeciesById(id) {
    if (!id || typeof id !== 'number') {
      throw new Error('Species ID must be a valid number');
    }

    const response = await apiClient.get(`/species/${id}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch species');
    }

    return response;
  },

  /**
   * Create new species
   * 
   * @param {object} data - Species data
   * @param {string} data.scientific_name - Scientific name (required)
   * @param {string} data.common_name - Common name (required)
   * @param {number} data.num_related_publications - Number of publications (required)
   * 
   * @returns {Promise<object>} - { success, data: {...}, message }
   * @throws {Error} - If validation fails or creation fails
   * 
   * @example
   * const result = await speciesService.createSpecies({
   *   scientific_name: 'Conus geographus',
   *   common_name: 'Geography cone',
   *   num_related_publications: 45
   * });
   */
  async createSpecies(data) {
    // Basic validation
    if (!data.scientific_name || !data.common_name) {
      throw new Error('Scientific name and common name are required');
    }

    if (typeof data.num_related_publications !== 'number') {
      throw new Error('Number of publications must be a number');
    }

    const response = await apiClient.post('/species', data);

    if (!response.success) {
      throw new Error(response.message || 'Failed to create species');
    }

    return response;
  },

  /**
   * Update existing species
   * 
   * @param {number} id - Species ID
   * @param {object} data - Partial species data to update
   * @param {string} [data.scientific_name] - Scientific name
   * @param {string} [data.common_name] - Common name
   * @param {number} [data.num_related_publications] - Number of publications
   * 
   * @returns {Promise<object>} - { success, data: {...}, message }
   * @throws {Error} - If update fails
   * 
   * @example
   * const result = await speciesService.updateSpecies(1, {
   *   common_name: 'New name'
   * });
   */
  async updateSpecies(id, data) {
    if (!id || typeof id !== 'number') {
      throw new Error('Species ID must be a valid number');
    }

    if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
      throw new Error('At least one field must be provided for update');
    }

    const response = await apiClient.put(`/species/${id}`, data);

    if (!response.success) {
      throw new Error(response.message || 'Failed to update species');
    }

    return response;
  },

  /**
   * Delete species
   * 
   * @param {number} id - Species ID
   * @returns {Promise<object>} - { success, data: {id}, message }
   * @throws {Error} - If deletion fails
   * 
   * @example
   * const result = await speciesService.deleteSpecies(1);
   * console.log(result.data.id); // Deleted species ID
   */
  async deleteSpecies(id) {
    if (!id || typeof id !== 'number') {
      throw new Error('Species ID must be a valid number');
    }

    const response = await apiClient.delete(`/species/${id}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete species');
    }

    return response;
  },
};
