import api from './api'

export const storageService = {
  getUsage: async () => {
    return await api.get('/storage/usage')
  },
}
