import api from './api'

export const authService = {
  register: async (data) => {
    return await api.post('/auth/register', data)
  },

  login: async (data) => {
    return await api.post('/auth/login', data)
  },

  getCurrentUser: async () => {
    return await api.get('/auth/me')
  },
}
