import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true,
  validateStatus: status => status < 500
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/signup', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const restaurantAPI = {
  getAll: () => api.get('/restaurants'),
  get: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
  getMyRestaurant: () => api.get('/restaurants/me'),
};

export const menuAPI = {
  getItems: (restaurantId) => api.get(`/restaurants/${restaurantId}/menu-items`),
  createItem: (restaurantId, data) => api.post(`/restaurants/${restaurantId}/menu-items`, {
    ...data,
    restaurant: restaurantId
  }),
  updateItem: (restaurantId, id, data) => api.put(`/restaurants/${restaurantId}/menu-items/${id}`, {
    ...data,
    restaurant: restaurantId
  }),
  deleteItem: (restaurantId, id) => api.delete(`/restaurants/${restaurantId}/menu-items/${id}`),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}`, { status }),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  getRestaurantOrders: () => api.get('/orders/restaurant/orders'),
  getUserOrders: () => api.get('/orders/user/orders')
};

export const paymentAPI = {
  createPaymentIntent: (data) => api.post('/payments/create-payment-intent', data),
  confirmPayment: (paymentIntentId) => api.post('/payments/confirm-payment', { paymentIntentId })
};

export default api;
