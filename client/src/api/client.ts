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

// ============ Campaigns Endpoints ============
export const campaignsApi = {
  // Campaigns
  getAllCampaigns: () =>
    api.get('/campaigns'),

  getCampaign: (campaignId: string) =>
    api.get(`/campaigns/${campaignId}`),

  createCampaign: (name: string, description?: string) =>
    api.post('/campaigns', { name, description }),

  updateCampaign: (campaignId: string, data: any) =>
    api.patch(`/campaigns/${campaignId}`, data),

  deleteCampaign: (campaignId: string) =>
    api.delete(`/campaigns/${campaignId}`),

  // Scenes
  getScenes: (campaignId: string) =>
    api.get(`/campaigns/${campaignId}/scenes`),

  getScene: (campaignId: string, sceneId: string) =>
    api.get(`/campaigns/${campaignId}/scenes/${sceneId}`),

  createScene: (campaignId: string, name: string, description?: string) =>
    api.post(`/campaigns/${campaignId}/scenes`, { name, description }),

  updateScene: (campaignId: string, sceneId: string, data: any) =>
    api.patch(`/campaigns/${campaignId}/scenes/${sceneId}`, data),

  saveSceneGraph: (campaignId: string, sceneId: string, nodes: any, edges: any, viewport?: any) =>
    api.post(`/campaigns/${campaignId}/scenes/${sceneId}/graph`, { nodes, edges, viewport }),

  deleteScene: (campaignId: string, sceneId: string) =>
    api.delete(`/campaigns/${campaignId}/scenes/${sceneId}`),

  duplicateScene: (campaignId: string, sceneId: string, name?: string) =>
    api.post(`/campaigns/${campaignId}/scenes/${sceneId}/duplicate`, { name }),

  reorderScenes: (campaignId: string, sceneOrders: any) =>
    api.patch(`/campaigns/${campaignId}/scenes/reorder`, { sceneOrders }),
};

// ============ NPCs Endpoints ============
export const npcsApi = {
  getNPCs: (campaignId: string) =>
    api.get(`/npcs/campaigns/${campaignId}`),

  getNPC: (npcId: string) =>
    api.get(`/npcs/${npcId}`),

  createNPC: (campaignId: string, data: any) =>
    api.post(`/npcs/campaigns/${campaignId}`, data),

  updateNPC: (npcId: string, data: any) =>
    api.patch(`/npcs/${npcId}`, data),

  deleteNPC: (npcId: string) =>
    api.delete(`/npcs/${npcId}`),
};

// ============ Quests Endpoints ============
export const questsApi = {
  getQuests: (campaignId: string) =>
    api.get(`/quests/campaigns/${campaignId}`),

  getQuest: (questId: string) =>
    api.get(`/quests/${questId}`),

  createQuest: (campaignId: string, name: string, description: string, objectives?: string[]) =>
    api.post(`/quests/campaigns/${campaignId}`, { name, description, objectives }),

  updateQuest: (questId: string, data: any) =>
    api.patch(`/quests/${questId}`, data),

  updateQuestStatus: (questId: string, status: string) =>
    api.patch(`/quests/${questId}/status`, { status }),

  updateQuestObjective: (questId: string, objectiveId: string, completed: boolean) =>
    api.patch(`/quests/${questId}/objectives/${objectiveId}`, { completed }),

  deleteQuest: (questId: string) =>
    api.delete(`/quests/${questId}`),
};

// ============ AI Endpoints ============
export const aiApi = {
  generateDialogue: (speaker: string, npcPersonality?: string, sceneSoFar?: string, campaignContext?: string) =>
    api.post('/ai/generate-dialogue', { speaker, npcPersonality, sceneSoFar, campaignContext }),

  generateNPC: (name: string, role?: string, campaignSetting?: string) =>
    api.post('/ai/generate-npc', { name, role, campaignSetting }),

  suggestBranches: (currentScene: string, playerActions?: string, campaignGoal?: string, numberOfSuggestions?: number) =>
    api.post('/ai/suggest-branches', { currentScene, playerActions, campaignGoal, numberOfSuggestions }),

  generateQuest: (questTheme?: string, campaignContext?: string, rewardType?: string) =>
    api.post('/ai/generate-quest', { questTheme, campaignContext, rewardType }),

  analyzeCampaign: (campaignId: string) =>
    api.post('/api/analyze-campaign', { campaignId }),
};

export default api;
