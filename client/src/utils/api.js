import axios from 'axios';

const API = axios.create({
  baseURL: 'https://entreskillhub.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const ideasAPI = {
  getAll: () => API.get('/ideas'),
  getById: (id) => API.get(`/ideas/${id}`),
  matchBySkills: (skills) => API.post('/ideas/match', { skills }),
  create: (data) => API.post('/ideas', data),
  delete: (id) => API.delete(`/ideas/${id}`)
};

export const roadmapAPI = {
  getAll: () => API.get('/roadmaps'),
  getByIdeaId: (ideaId) => API.get(`/roadmaps/${ideaId}`)
};

export const progressAPI = {
  getAll: () => API.get('/progress'),
  start: (data) => API.post('/progress/start', data),
  update: (id, data) => API.put(`/progress/${id}`, data),
  bookmark: (ideaId) => API.post(`/progress/bookmark/${ideaId}`),
  getBookmarks: () => API.get('/progress/bookmarks')
};

export const mentorAPI = {
  getAll: () => API.get('/mentors'),
  getById: (id) => API.get(`/mentors/${id}`),
  register: (data) => API.post('/mentors/register', data),
  search: (expertise) => API.post('/mentors/search', { expertise }),
  updateProfile: (data) => API.put('/mentors/profile', data)
};

export default API;