import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  volumes: JSON.parse(localStorage.getItem('volumes') || '[]'),
  currentVolume: null,
}

const volumesSlice = createSlice({
  name: 'volumes',
  initialState,
  reducers: {
    setVolumes: (state, action) => {
      state.volumes = action.payload
      localStorage.setItem('volumes', JSON.stringify(action.payload))
    },
    addVolume: (state, action) => {
      state.volumes.push(action.payload)
      localStorage.setItem('volumes', JSON.stringify(state.volumes))
    },
    updateVolume: (state, action) => {
      const index = state.volumes.findIndex(v => v.id === action.payload.id)
      if (index !== -1) {
        state.volumes[index] = action.payload
        localStorage.setItem('volumes', JSON.stringify(state.volumes))
      }
    },
    removeVolume: (state, action) => {
      state.volumes = state.volumes.filter(v => v.id !== action.payload)
      localStorage.setItem('volumes', JSON.stringify(state.volumes))
    },
    setCurrentVolume: (state, action) => {
      state.currentVolume = action.payload
    },
  },
})

export const {
  setVolumes,
  addVolume,
  updateVolume,
  removeVolume,
  setCurrentVolume,
} = volumesSlice.actions

export default volumesSlice.reducer
