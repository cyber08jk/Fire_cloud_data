import axios from 'axios'
import api from './api'

export const fileService = {
  uploadFile: async (file, folderId, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    if (folderId) {
      formData.append('folderId', folderId)
    }

    const token = localStorage.getItem('token')
    return await axios.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress?.(progress)
      },
    })
  },

  listFiles: async (folderId = null) => {
    const params = folderId ? { folderId } : {}
    return await api.get('/files', { params })
  },

  getFile: async (id) => {
    return await api.get(`/files/${id}`)
  },

  downloadFile: async (id, filename) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`/api/files/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },

  searchFiles: async (query, page = 0, size = 20) => {
    return await api.get('/files/search', { params: { q: query, page, size } })
  },

  getStarredFiles: async () => {
    return await api.get('/files/starred')
  },

  getRecentFiles: async () => {
    return await api.get('/files/recent')
  },

  toggleStar: async (id) => {
    return await api.post(`/files/${id}/star`)
  },

  renameFile: async (id, name) => {
    return await api.put(`/files/${id}`, null, { params: { name } })
  },

  deleteFile: async (id) => {
    return await api.delete(`/files/${id}`)
  },
}
