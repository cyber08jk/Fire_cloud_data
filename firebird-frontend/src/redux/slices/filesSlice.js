import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  files: [],
  currentFile: null,
  loading: false,
  uploading: false,
  uploadProgress: 0,
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles: (state, action) => {
      state.files = action.payload
    },
    addFile: (state, action) => {
      state.files.unshift(action.payload)
    },
    updateFile: (state, action) => {
      const index = state.files.findIndex(f => f.id === action.payload.id)
      if (index !== -1) {
        state.files[index] = action.payload
      }
    },
    removeFile: (state, action) => {
      state.files = state.files.filter(f => f.id !== action.payload)
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setUploading: (state, action) => {
      state.uploading = action.payload
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload
    },
  },
})

export const {
  setFiles,
  addFile,
  updateFile,
  removeFile,
  setCurrentFile,
  setLoading,
  setUploading,
  setUploadProgress,
} = filesSlice.actions

export default filesSlice.reducer
