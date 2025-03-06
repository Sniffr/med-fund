/**
 * API utility functions for making requests to the backend
 */

/**
 * Fetch campaigns with optional filters
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Number of items per page
 * @param {string} options.category - Filter by category
 * @param {string} options.sort - Sort field
 * @param {string} options.status - Filter by status
 * @returns {Promise<Object>} - Paginated campaigns data
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
