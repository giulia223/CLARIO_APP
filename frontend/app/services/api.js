// API base configuration
const API_BASE_URL = 'http://localhost:4000'; // Change to your backend URL

// Generic fetch wrapper
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Tasks API
export const tasksAPI = {
  getAll: (userId) => apiCall(`/tasks?userId=${userId}`),
  create: (taskData) => apiCall('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  update: (id, updates) => apiCall(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
  delete: (id) => apiCall(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};

// Journal API
export const journalAPI = {
  getAll: (userId) => apiCall(`/journalEntry?userId=${userId}`),
  create: (entryData) => apiCall('/journalEntry', {
    method: 'POST',
    body: JSON.stringify(entryData),
  }),
  update: (id, updates) => apiCall(`/journalEntry/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
  delete: (id) => apiCall(`/journalEntry/${id}`, {
    method: 'DELETE',
  }),
};

// Emotions API
export const emotionsAPI = {
  getAll: () => apiCall('/emotions'),
  getByMood: (mood) => apiCall(`/emotions/${mood}`),
  update: (id, updates) => apiCall(`/emotions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
};

// Favorites API
export const favoritesAPI = {
  getAll: (userId) => apiCall(`/favorites?userId=${userId}`),
  create: (favoriteData) => apiCall('/favorites', {
    method: 'POST',
    body: JSON.stringify(favoriteData),
  }),
  delete: (id) => apiCall(`/favorites/${id}`, {
    method: 'DELETE',
  }),
};

// Google Calendar API (using our backend)
export const googleCalendarAPI = {
  addEvent: (eventData) => apiCall('/api/google/add-event', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
};

// Badges API
export const badgesAPI = {
  getAll: (userId) => apiCall(`/badges/${userId}`),
  checkForBadge: (userId, badgeId) => apiCall(`/badges/check/${userId}/${badgeId}`, {
    method: 'POST',
  }),
};

export default apiCall;

