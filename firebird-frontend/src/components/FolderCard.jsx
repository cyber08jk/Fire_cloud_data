import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Folder, Star, Trash2, Edit, MoreVertical, Lock, Unlock } from 'lucide-react'
import { folderService } from '../services/folderService'
import { setCurrentFolder } from '../redux/slices/foldersSlice'
import PasswordLockModal from './PasswordLockModal'
import { toast } from 'react-toastify'

function FolderCard({ folder, onUpdate, viewMode = 'grid' }) {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState(folder.name)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordMode, setPasswordMode] = useState('lock')

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleToggleStar = async () => {
    try {
      await folderService.toggleStar(folder.id)
      toast.success(folder.starred ? 'Removed from starred' : 'Added to starred')
      onUpdate()
    } catch (error) {
      console.error('Toggle star failed:', error)
    }
  }

  const handleRename = async () => {
    if (!newName.trim() || newName === folder.name) {
      setRenaming(false)
      return
    }

    try {
      await folderService.renameFolder(folder.id, newName)
      toast.success('Folder renamed')
      setRenaming(false)
      onUpdate()
    } catch (error) {
      console.error('Rename failed:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Move this folder to trash?')) return

    try {
      await folderService.deleteFolder(folder.id)
      toast.success('Folder moved to trash')
      onUpdate()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const handleOpenFolder = async () => {
    if (renaming) return
    
    // If folder is locked, ask for password first
    if (folder.locked) {
      setPasswordMode('unlock')
      setShowPasswordModal(true)
    } else {
      dispatch(setCurrentFolder(folder))
    }
  }

  const handleLock = async (folder, password) => {
    try {
      await folderService.lockFolder(folder.id, password)
      toast.success('Folder locked successfully')
      onUpdate()
    } catch (error) {
      toast.error('Failed to lock folder')
      throw error
    }
  }

  const handleUnlock = async (folder, password) => {
    try {
      await folderService.unlockFolder(folder.id, password)
      toast.success('Folder unlocked successfully')
      // Open the folder after unlocking
      dispatch(setCurrentFolder(folder))
      onUpdate()
    } catch (error) {
      toast.error('Invalid password')
      throw error
    }
  }

  const handleToggleLock = () => {
    if (folder.locked) {
      setPasswordMode('unlock')
    } else {
      setPasswordMode('lock')
    }
    setShowPasswordModal(true)
    setShowMenu(false)
  }

  // List View
  if (viewMode === 'list') {
    return (
      <>
        <div 
          onClick={handleOpenFolder}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Folder className="w-10 h-10 text-blue-500 flex-shrink-0" />
              {folder.locked && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Lock className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          
            <div className="flex-1 min-w-0">
              {renaming ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleRename}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') handleRename()
                  }}
                  className="w-full px-2 py-1 text-sm border border-blue-500 rounded dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
              ) : (
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {folder.name}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(folder.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleStar(); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Star className={`w-4 h-4 ${folder.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </button>
              
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); setRenaming(true); setShowMenu(false); }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Rename
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleLock(); }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {folder.locked ? (
                        <>
                          <Unlock className="w-4 h-4 mr-2" />
                          Unlock
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Lock
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(); setShowMenu(false); }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <PasswordLockModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          folder={folder}
          onLock={handleLock}
          onUnlock={handleUnlock}
          mode={passwordMode}
        />
      </>
    )
  }

  // Grid View
  return (
    <>
      <div 
        onClick={handleOpenFolder}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all relative group cursor-pointer"
      >
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); handleToggleStar(); }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Star
              className={`w-4 h-4 ${folder.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
            />
          </button>
          
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); setRenaming(true); setShowMenu(false); }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Rename
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleLock(); }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {folder.locked ? (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Lock
                    </>
                  )}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(); setShowMenu(false); }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <Folder className="w-12 h-12 text-blue-500 mb-3" />
            {folder.locked && (
              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                <Lock className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          {renaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleRename}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter') handleRename()
              }}
              className="w-full px-2 py-1 text-sm border border-blue-500 rounded text-center dark:bg-gray-700 dark:text-white"
              autoFocus
            />
          ) : (
            <p className="text-sm font-medium text-gray-900 dark:text-white text-center truncate w-full px-2">
              {folder.name}
            </p>
          )}
        </div>
      </div>

      <PasswordLockModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        folder={folder}
        onLock={handleLock}
        onUnlock={handleUnlock}
        mode={passwordMode}
      />
    </>
  )
}

export default FolderCard
