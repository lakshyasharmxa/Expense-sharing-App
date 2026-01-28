import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API Error: No response received', error.request);
    } else {
      // Something else happened
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (userData) => api.post('/auth/register', userData);
export const login = (userData) => api.post('/auth/login', userData);

// Groups
export const createGroup = (groupData) => api.post('/groups', groupData);
export const joinGroup = (invitationCode) => api.post('/groups/join', { invitationCode });
export const getUserGroups = () => api.get('/groups');
export const getGroupById = (id) => api.get(`/groups/${id}`);

// Expenses
export const createExpense = (expenseData) => api.post('/expenses', expenseData);
export const getGroupExpenses = (groupId) => api.get(`/expenses/group/${groupId}`);
export const getBalances = (groupId) => api.get(`/expenses/group/${groupId}/balances`);
export const getSettlementSuggestions = (groupId) => api.get(`/expenses/group/${groupId}/settlements`);