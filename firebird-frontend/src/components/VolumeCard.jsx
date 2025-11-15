import { HardDrive, MoreVertical, Edit, Trash2, Lock } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const VolumeCard = ({ volume, onEdit, onDelete, onLock, onOpen }) => {
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const percentage = (volume.used / volume.total) * 100

  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }

  const handleOpenVolume = () => {
    if (onOpen) {
      onOpen(volume)
    }
  }

  return (
    <div 
      onClick={handleOpenVolume}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group relative"
    >
      {/* Menu Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(volume); setShowMenu(false); }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Rename
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onLock(volume); setShowMenu(false); }}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Lock className="w-4 h-4 mr-2" />
              {volume.locked ? 'Unlock' : 'Lock'} Volume
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(volume); setShowMenu(false); }}
              className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Volume Icon */}
      <div className={`w-12 h-12 ${volume.color || 'bg-indigo-600'} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <HardDrive className="w-6 h-6 text-white" />
        {volume.locked && (
          <Lock className="w-3 h-3 text-white absolute -top-1 -right-1" />
        )}
      </div>

      {/* Volume Name */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{volume.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {volume.fileCount || 0} files
      </p>

      {/* Storage Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{formatSize(volume.used)}</span>
          <span className="font-medium text-gray-900 dark:text-white">{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${volume.color || 'bg-indigo-600'} transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
          {formatSize(volume.total)} total
        </p>
      </div>
    </div>
  )
}

export default VolumeCard
