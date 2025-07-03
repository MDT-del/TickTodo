import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Tasks API
export const tasksApi = {
  getTasks: (params = {}) => api.get('/api/tasks', { params }),
  getTask: (id) => api.get(`/api/tasks/${id}`),
  createTask: (task) => api.post('/api/tasks', task),
  updateTask: (id, task) => api.put(`/api/tasks/${id}`, task),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),
  
  // Subtasks
  addSubtask: (taskId, subtask) => api.post(`/api/tasks/${taskId}/subtasks`, subtask),
  updateSubtask: (taskId, subtaskId, completed) => 
    api.put(`/api/tasks/${taskId}/subtasks/${subtaskId}`, { completed }),
  deleteSubtask: (taskId, subtaskId) => 
    api.delete(`/api/tasks/${taskId}/subtasks/${subtaskId}`),
};

// Lists API
export const listsApi = {
  getLists: () => api.get('/api/lists'),
  createList: (list) => api.post('/api/lists', list),
  updateList: (id, list) => api.put(`/api/lists/${id}`, list),
  deleteList: (id) => api.delete(`/api/lists/${id}`),
};

// Tags API
export const tagsApi = {
  getTags: () => api.get('/api/tags'),
  createTag: (tag) => api.post('/api/tags', tag),
  deleteTag: (id) => api.delete(`/api/tags/${id}`),
};

// Stats API
export const statsApi = {
  getStats: () => api.get('/api/stats'),
};

// Combined API object
const apiService = {
  // Tasks
  getTasks: tasksApi.getTasks,
  getTask: tasksApi.getTask,
  createTask: tasksApi.createTask,
  updateTask: tasksApi.updateTask,
  deleteTask: tasksApi.deleteTask,
  
  // Subtasks
  addSubtask: tasksApi.addSubtask,
  updateSubtask: tasksApi.updateSubtask,
  deleteSubtask: tasksApi.deleteSubtask,
  
  // Lists
  getLists: listsApi.getLists,
  createList: listsApi.createList,
  updateList: listsApi.updateList,
  deleteList: listsApi.deleteList,
  
  // Tags
  getTags: tagsApi.getTags,
  createTag: tagsApi.createTag,
  deleteTag: tagsApi.deleteTag,
  
  // Stats
  getStats: statsApi.getStats,
};

export default apiService;