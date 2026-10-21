import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for httpOnly refresh token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory or localStorage token cache for the short-lived access token
let accessToken = localStorage.getItem('sd_access_token') || null;

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('sd_access_token', token);
  } else {
    localStorage.removeItem('sd_access_token');
  }
};

export const getAccessToken = () => accessToken;

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto-Refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAccessToken(null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getMe: () => api.get('/auth/me'),
};

// Portfolio Data Services
export const portfolioService = {
  // Public GET
  getAllData: () => api.get('/portfolio'),
  
  // Profile & Socials
  updateProfile: (profileData) => api.put('/portfolio/profile', profileData),
  updateSocials: (socialsData) => api.put('/portfolio/socials', socialsData),

  // Specializations
  createSpecialization: (data) => api.post('/portfolio/specializations', data),
  updateSpecialization: (id, data) => api.put(`/portfolio/specializations/${id}`, data),
  deleteSpecialization: (id) => api.delete(`/portfolio/specializations/${id}`),

  // Experience
  createExperience: (data) => api.post('/portfolio/experience', data),
  updateExperience: (id, data) => api.put(`/portfolio/experience/${id}`, data),
  deleteExperience: (id) => api.delete(`/portfolio/experience/${id}`),

  // Projects
  createProject: (data) => api.post('/portfolio/projects', data),
  updateProject: (id, data) => api.put(`/portfolio/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/portfolio/projects/${id}`),

  // Certificates
  createCertificate: (data) => api.post('/portfolio/certificates', data),
  updateCertificate: (id, data) => api.put(`/portfolio/certificates/${id}`, data),
  deleteCertificate: (id) => api.delete(`/portfolio/certificates/${id}`),

  // CV / Resume
  updateCV: (cvData) => api.put('/portfolio/cv', cvData),
  deleteCV: () => api.delete('/portfolio/cv'),

  // Contact / Inquiries
  sendMessage: (messageData) => api.post('/contact', messageData),
  getMessages: () => api.get('/contact/messages'),
  markMessageRead: (id) => api.patch(`/contact/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/messages/${id}`),
  sendDirectEmail: (emailData) => api.post('/contact/send-email', emailData),

  // Upload to Cloudinary via backend
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadMultipleImages: (formData) => api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default api;
