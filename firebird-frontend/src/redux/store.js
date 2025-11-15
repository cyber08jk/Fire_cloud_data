import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import filesReducer from './slices/filesSlice'
import foldersReducer from './slices/foldersSlice'
import uiReducer from './slices/uiSlice'
import volumesReducer from './slices/volumesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: filesReducer,
    folders: foldersReducer,
    ui: uiReducer,
    volumes: volumesReducer,
  },
})
