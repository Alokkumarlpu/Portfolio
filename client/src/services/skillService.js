import api from './api';

export const skillService = {
  getAllSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  createSkill: async (skillData) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },

  updateSkill: async (id, skillData) => {
    const response = await api.put(`/skills/${id}`, skillData);
    return response.data;
  },

  deleteSkill: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  }
};
