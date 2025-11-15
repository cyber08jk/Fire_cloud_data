import api from './api'

export const folderService = {
  createFolder: async (name, parentId = null) => {
    const params = { name }
    if (parentId) params.parentId = parentId
    return await api.post('/folders', null, { params })
  },

  listFolders: async (parentId = null) => {
    const params = parentId ? { parentId } : {}
    return await api.get('/folders', { params })
  },

  getFolder: async (id) => {
    return await api.get(`/folders/${id}`)
  },

  renameFolder: async (id, name) => {
    return await api.put(`/folders/${id}`, null, { params: { name } })
  },

  toggleStar: async (id) => {
    return await api.post(`/folders/${id}/star`)
  },

  deleteFolder: async (id) => {
    return await api.delete(`/folders/${id}`)
  },

  lockFolder: async (id, password) => {
    return await api.post(`/folders/${id}/lock`, null, { params: { password } })
  },

  unlockFolder: async (id, password) => {
    return await api.post(`/folders/${id}/unlock`, null, { params: { password } })
  },

  verifyPassword: async (id, password) => {
    return await api.post(`/folders/${id}/verify-password`, null, { params: { password } })
  },
}
