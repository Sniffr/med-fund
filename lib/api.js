/**
 * API utility functions for making requests to the backend
 */

/**
 * Fetch campaigns with optional filters
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of items per page
 * @param {string} [options.category] - Filter by category
 * @param {string} [options.sort] - Sort field
 * @param {string} [options.status] - Filter by status
 * @param {string} [options.search] - Search term
 * @param {boolean} [options.featured] - Filter featured campaigns
 * @param {boolean} [options.submittedForVerification] - Filter by verification status
 * @param {string} [options.priority] - Filter by priority
 * @returns {Promise<{campaigns: Array, pagination: {total: number, page: number, limit: number, pages: number}}>} - Paginated campaigns data
 */
export async function fetchCampaigns(options = {}) {
  const queryParams = new URLSearchParams();
  
  // Add query parameters if provided
  if (options.page) queryParams.append('page', options.page);
  if (options.limit) queryParams.append('limit', options.limit);
  if (options.category) queryParams.append('category', options.category);
  if (options.sort) queryParams.append('sort', options.sort);
  if (options.status) queryParams.append('status', options.status);
  if (options.featured) queryParams.append('featured', options.featured);
  if (options.search) queryParams.append('search', options.search);
  if (options.submittedForVerification) queryParams.append('submittedForVerification', options.submittedForVerification);
  if (options.priority) queryParams.append('priority', options.priority);
  
  const url = `/api/campaigns${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch campaigns');
  }
  
  return response.json();
}

/**
 * Fetch a single campaign by ID
 * @param {string} id - Campaign ID
 * @returns {Promise<Object>} - Campaign data
 */
export async function fetchCampaignById(id) {
  const response = await fetch(`/api/campaigns/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch campaign');
  }
  
  return response.json();
}

/**
 * Create a new campaign
 * @param {FormData} formData - Campaign form data
 * @returns {Promise<Object>} - Created campaign data
 */
export async function createCampaign(formData) {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create campaign');
  }
  
  return response.json();
}

/**
 * Make a donation to a campaign
 * @param {Object} donationData - Donation data
 * @returns {Promise<Object>} - Created donation data
 */
export async function makeDonation(donationData) {
  const response = await fetch('/api/donations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donationData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to process donation');
  }
  
  return response.json();
}

/**
 * Fetch donations for a campaign
 * @param {string} campaignId - Campaign ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Paginated donations data
 */
export async function fetchDonations(campaignId, options = {}) {
  const queryParams = new URLSearchParams();
  
  // Add query parameters if provided
  if (options.page) queryParams.append('page', options.page);
  if (options.limit) queryParams.append('limit', options.limit);
  
  const url = `/api/campaigns/${campaignId}/donations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch donations');
  }
  
  return response.json();
}

/**
 * Login user with email and password
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} - User data and token
 */
export async function loginUser(credentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return response.json();
}

/**
 * Register a new user
 * @param {Object} userData - User data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} - Created user data
 */
export async function registerUser(userData) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  
  return response.json();
}

/**
 * Get current authenticated user
 * @returns {Promise<Object>} - User data
 */
export async function getCurrentUser() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include', // Include cookies in the request
  });
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  return data.user;
}

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Logout failed');
  }
  
  return response.json();
}
