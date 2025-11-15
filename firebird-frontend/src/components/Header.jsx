import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Bell, Moon, Sun, User } from 'lucide-react'
import { toggleDarkMode } from '../redux/slices/uiSlice'
import { logout } from '../redux/slices/authSlice'

function Header({ onRefresh }) {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state) => state.ui)
  const { user } = useSelector((state) => state.auth)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search file"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-8">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-2 pr-4 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                {user?.firstName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-14 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                {/* User Info Header */}
                <div className="p-6 border-b dark:border-gray-700">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium">
                    Manage your Account
                  </button>
                </div>

                {/* Menu Options */}
                <div className="py-2">
                  <button className="w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium">Profile</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View and edit your profile</p>
                    </div>
                  </button>

                  <button className="w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium">Settings</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Preferences and privacy</p>
                    </div>
                  </button>

                  <button className="w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium">FireBird</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">9.4 GB of 15 GB used</p>
                    </div>
                  </button>

                  <button className="w-full px-6 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium">Help & Support</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get help and feedback</p>
                    </div>
                  </button>
                </div>

                {/* Privacy & Terms */}
                <div className="px-6 py-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <button className="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</button>
                    <span>•</span>
                    <button className="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</button>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="p-3 border-t dark:border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg flex items-center justify-center gap-2 text-red-600 dark:text-red-400 transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
