import api from './api';

export const profileService = {
  getProfile: async () => {
    const response = await api.get(`/profile?t=${Date.now()}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  uploadProfileImage: async (file) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;

    if (!token) {
      throw new Error('Not logged in. Please login first.');
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await api.post('/profile/upload-image', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  uploadResumePDF: async (file) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo?.token;

    if (!token) {
      throw new Error('Not logged in. Please login first.');
    }

    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/profile/upload-resume', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
