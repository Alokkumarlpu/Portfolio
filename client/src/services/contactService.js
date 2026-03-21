import api from './api';

export const contactService = {
  submitContact: async (formData) => {
    const response = await api.post('/contact', formData);
    return response.data;
  },

  getAllMessages: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/contact/${id}`);
    return response.data;
  }
};
