import api from './api';

export const experienceService = {
  getAllExperience: async () => {
    const response = await api.get('/experience');
    return response.data;
  },

  createExperience: async (expData) => {
    const response = await api.post('/experience', expData);
    return response.data;
  },

  updateExperience: async (id, expData) => {
    const response = await api.put(`/experience/${id}`, expData);
    return response.data;
  },

  deleteExperience: async (id) => {
    const response = await api.delete(`/experience/${id}`);
    return response.data;
  }
};
