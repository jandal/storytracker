import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ Auth Endpoints ============
export const authApi = {
  register: (email: string, password: string, name?: string) =>
    api.post('/auth/register', { email, password, name }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    api.get('/auth/me'),
};

// ============ Settings Endpoints ============
export const settingsApi = {
  getSettings: () =>
    api.get('/settings'),

  updateApiKey: (apiKey: string, model: string) =>
    api.post('/settings/anthropic', { apiKey, model }),

  testApiKey: (apiKey: string, model: string) =>
    api.post('/settings/anthropic/test', { apiKey, model }),

  removeApiKey: () =>
    api.delete('/settings/anthropic'),
};

// ============ Variables Endpoints ============
export const variablesApi = {
  // Global variables
  getGlobalVariables: (campaignId: string) =>
    api.get(`/variables/global/campaigns/${campaignId}`),

  createGlobalVariable: (campaignId: string, name: string, type: string, value?: any) =>
    api.post(`/variables/global/campaigns/${campaignId}`, { name, type, value }),

  updateGlobalVariable: (variableId: string, value: any) =>
    api.patch(`/variables/global/${variableId}`, { value }),

  deleteGlobalVariable: (variableId: string) =>
    api.delete(`/variables/global/${variableId}`),

  // Local variables
  getLocalVariables: (sceneId: string) =>
    api.get(`/variables/local/scenes/${sceneId}`),

  createLocalVariable: (sceneId: string, name: string, type: string, value?: any) =>
    api.post(`/variables/local/scenes/${sceneId}`, { name, type, value }),

  updateLocalVariable: (variableId: string, value: any) =>
    api.patch(`/variables/local/${variableId}`, { value }),

  deleteLocalVariable: (variableId: string) =>
    api.delete(`/variables/local/${variableId}`),
};

export default api;
