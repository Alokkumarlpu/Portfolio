import api from './api';

export const achievementService = {
  getAllAchievements: async () => {
    const response = await api.get('/achievements');
    return response.data;
  },

  createAchievement: async (data) => {
    const response = await api.post('/achievements', data);
    return response.data;
  },

  updateAchievement: async (id, data) => {
    const response = await api.put(`/achievements/${id}`, data);
    return response.data;
  },

  deleteAchievement: async (id) => {
    const response = await api.delete(`/achievements/${id}`);
    return response.data;
  }
};
