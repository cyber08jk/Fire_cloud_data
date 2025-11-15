import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  folders: [],
  currentFolder: null,
  folderPath: [], // Breadcrumb path
  loading: false,
}

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {
    setFolders: (state, action) => {
      state.folders = action.payload
    },
    addFolder: (state, action) => {
      state.folders.unshift(action.payload)
    },
    updateFolder: (state, action) => {
      const index = state.folders.findIndex(f => f.id === action.payload.id)
      if (index !== -1) {
        state.folders[index] = action.payload
      }
    },
    removeFolder: (state, action) => {
      state.folders = state.folders.filter(f => f.id !== action.payload)
    },
    setCurrentFolder: (state, action) => {
      const folder = action.payload
      state.currentFolder = folder
      
      // Update breadcrumb path
      if (!folder) {
        state.folderPath = []
      } else {
        // Check if folder is already in path
        const existingIndex = state.folderPath.findIndex(f => f.id === folder.id)
        if (existingIndex !== -1) {
          // Navigate back - trim path to this folder
          state.folderPath = state.folderPath.slice(0, existingIndex + 1)
        } else {
          // Navigate forward - add to path
          state.folderPath = [...state.folderPath, folder]
        }
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const {
  setFolders,
  addFolder,
  updateFolder,
  removeFolder,
  setCurrentFolder,
  setLoading,
} = foldersSlice.actions

export default foldersSlice.reducer
