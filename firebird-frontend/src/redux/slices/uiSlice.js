import { createSlice } from '@reduxjs/toolkit'

const getDarkModeInitialState = () => {
  const saved = localStorage.getItem('darkMode')
  if (saved === null) return false
  return saved === 'true'
}

const initialState = {
  view: 'grid', // 'grid' or 'list'
  showUploadModal: false,
  showShareModal: false,
  showCreateFolderModal: false,
  selectedItems: [],
  previewFile: null,
  previewOpen: false,
  darkMode: getDarkModeInitialState(),
  searchQuery: '',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setView: (state, action) => {
      state.view = action.payload
    },
    toggleUploadModal: (state) => {
      state.showUploadModal = !state.showUploadModal
    },
    toggleShareModal: (state) => {
      state.showShareModal = !state.showShareModal
    },
    toggleCreateFolderModal: (state) => {
      state.showCreateFolderModal = !state.showCreateFolderModal
    },
    setSelectedItems: (state, action) => {
      state.selectedItems = action.payload
    },
    clearSelectedItems: (state) => {
      state.selectedItems = []
    },
    openPreview: (state, action) => {
      state.previewFile = action.payload
      state.previewOpen = true
    },
    closePreview: (state) => {
      state.previewFile = null
      state.previewOpen = false
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', String(state.darkMode))
      console.log('Dark mode toggled to:', state.darkMode)
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
  },
})

export const {
  setView,
  toggleUploadModal,
  toggleShareModal,
  toggleCreateFolderModal,
  setSelectedItems,
  clearSelectedItems,
  openPreview,
  closePreview,
  toggleDarkMode,
  setSearchQuery,
} = uiSlice.actions

export default uiSlice.reducer
