import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { setUser } from './redux/slices/authSlice'

function App() {
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)
  const { darkMode } = useSelector((state) => state.ui)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      dispatch(setUser({ user: JSON.parse(storedUser), token: storedToken }))
    }
  }, [dispatch])

  useEffect(() => {
    console.log('Dark mode changed to:', darkMode)
    if (darkMode) {
      document.documentElement.classList.add('dark')
      console.log('Added dark class to html')
    } else {
      document.documentElement.classList.remove('dark')
      console.log('Removed dark class from html')
    }
  }, [darkMode])

  return (
    <>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
        <Route path="/*" element={token ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
    </>
  )
}

export default App
