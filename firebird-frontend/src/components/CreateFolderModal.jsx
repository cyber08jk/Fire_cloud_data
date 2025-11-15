import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { X } from 'lucide-react'
import { toggleCreateFolderModal } from '../redux/slices/uiSlice'
import { folderService } from '../services/folderService'
import { toast } from 'react-toastify'

function CreateFolderModal({ onFolderCreated }) {
  const dispatch = useDispatch()
  const { showCreateFolderModal } = useSelector((state) => state.ui)
  const { currentFolder } = useSelector((state) => state.folders)
  const [folderName, setFolderName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!folderName.trim()) return

    setCreating(true)
    try {
      await folderService.createFolder(folderName, currentFolder?.id)
      toast.success('Folder created successfully')
      setFolderName('')
      dispatch(toggleCreateFolderModal())
      onFolderCreated()
    } catch (error) {
      console.error('Create folder failed:', error)
    } finally {
      setCreating(false)
    }
  }

  if (!showCreateFolderModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">New Folder</h2>
          <button
            onClick={() => dispatch(toggleCreateFolderModal())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleCreate}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => dispatch(toggleCreateFolderModal())}
              disabled={creating}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim() || creating}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFolderModal
