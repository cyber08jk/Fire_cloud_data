import { X, Lock, Unlock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const PasswordLockModal = ({ isOpen, onClose, folder, onLock, onUnlock, mode = 'lock' }) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!isOpen || !folder) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (mode === 'lock') {
      if (password.length < 4) {
        toast.error('Password must be at least 4 characters')
        return
      }
      
      if (password !== confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
    }

    setLoading(true)
    try {
      if (mode === 'lock') {
        await onLock(folder, password)
      } else {
        await onUnlock(folder, password)
      }
      setPassword('')
      setConfirmPassword('')
      onClose()
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            {mode === 'lock' ? (
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            ) : (
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Unlock className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {mode === 'lock' ? 'Lock Folder' : 'Unlock Folder'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{folder.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'lock' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Important:</strong> Remember this password. You'll need it to access this folder.
              </p>
            </div>
          )}

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {mode === 'lock' ? 'Create Password' : 'Enter Password'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password (only for lock mode) */}
          {mode === 'lock' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                required
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-3 text-white rounded-xl transition-colors font-medium disabled:opacity-50 ${
                mode === 'lock'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? 'Processing...' : mode === 'lock' ? 'Lock Folder' : 'Unlock Folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordLockModal
