import axios from 'axios'

// AFTER
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Attach JWT token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  googleLogin: () => { window.location.href = '/api/auth/google' },
}

// ── Products ──────────────────────────────────────────
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  // Admin
  adminGetAll: (params) => api.get('/products/admin/all', { params }),
  create: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/products/${id}`),
}

// ── Orders ────────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my'),
  // Admin
  getAll: (params) => api.get('/orders', { params }),
  getStats: () => api.get('/orders/stats'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
}

// ── Users (admin) ─────────────────────────────────────
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
}

export default api
