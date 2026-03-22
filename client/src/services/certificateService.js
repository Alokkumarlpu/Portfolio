import api from './api';

export const certificateService = {
  getAllCertificates: async () => {
    const response = await api.get('/certificates');
    return response.data;
  },

  createCertificate: async (data) => {
    const response = await api.post('/certificates', data);
    return response.data;
  },

  updateCertificate: async (id, data) => {
    const response = await api.put(`/certificates/${id}`, data);
    return response.data;
  },

  deleteCertificate: async (id) => {
    const response = await api.delete(`/certificates/${id}`);
    return response.data;
  }
};
