import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('phone');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login?expired=true';
      } else if (window.location.pathname === '/booking') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (name, email, phone, password) => api.post('/auth/register', { name, email, phone, password }),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('phone');
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
  isAdmin: () => localStorage.getItem('role') === 'ROLE_ADMIN',
  isPassenger: () => localStorage.getItem('role') === 'ROLE_PASSENGER',
  getUsername: () => localStorage.getItem('name') || localStorage.getItem('username') || 'User',
};

export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: (status, search) => {
    const params = {};
    if (status && status !== 'ALL') params.status = status;
    if (search) params.search = search;
    return api.get('/bookings', { params });
  },
  getById: (id) => api.get(`/bookings/${id}`),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
  getStats: () => api.get('/bookings/stats'),
  createPaymentOrder: (id) => api.post(`/bookings/${id}/payment/order`),
  verifyPayment: (id, paymentDetails) => api.post(`/bookings/${id}/payment/verify`, paymentDetails),
};

export const destinationsAPI = {
  getAll: () => api.get('/destinations'),
  create: (destinationData) => api.post('/destinations', destinationData),
  update: (id, destinationData) => api.put(`/destinations/${id}`, destinationData),
  delete: (id) => api.delete(`/destinations/${id}`),
};

export const reviewsAPI = {
  getApproved: () => api.get('/reviews'),
  getAllAdmin: () => api.get('/reviews/admin'),
  submit: (reviewData) => api.post('/reviews', reviewData),
  approve: (id) => api.put(`/reviews/${id}/approve`),
  delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;
