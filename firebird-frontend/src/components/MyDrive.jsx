import { useSelector, useDispatch } from 'react-redux'
import { Loader, Grid3x3, List, Plus, HardDrive, ArrowLeft } from 'lucide-react'
import { setView, toggleUploadModal, toggleCreateFolderModal } from '../redux/slices/uiSlice'
import { addVolume, updateVolume, removeVolume, setCurrentVolume } from '../redux/slices/volumesSlice'
import FileCard from './FileCard'
import FolderCard from './FolderCard'
import Breadcrumb from './Breadcrumb'
import VolumeCard from './VolumeCard'
import CreateVolumeModal from './CreateVolumeModal'
import { useState } from 'react'
import { toast } from 'react-toastify'

function MyDrive({ loading, onRefresh }) {
  const dispatch = useDispatch()
  const { files } = useSelector((state) => state.files)
  const { folders, currentFolder, folderPath } = useSelector((state) => state.folders)
  const { view } = useSelector((state) => state.ui)
  const [sortBy, setSortBy] = useState('name')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const [showVolumeModal, setShowVolumeModal] = useState(false)
  const { volumes, currentVolume } = useSelector((state) => state.volumes)

  const totalStorage = 16106127360 // 15 GB
  const usedStorage = files.reduce((total, file) => total + (file.size || 0), 0)

  const handleCreateVolume = (volume) => {
    dispatch(addVolume(volume))
    toast.success('Volume created successfully')
  }

  const handleEditVolume = (volume) => {
    const newName = prompt('Enter new volume name:', volume.name)
    if (newName && newName.trim()) {
      dispatch(updateVolume({ ...volume, name: newName.trim() }))
      toast.success('Volume renamed')
    }
  }

  const handleDeleteVolume = (volume) => {
    if (confirm(`Delete volume "${volume.name}"? This will not delete the files.`)) {
      dispatch(removeVolume(volume.id))
      toast.success('Volume deleted')
    }
  }

  const handleLockVolume = (volume) => {
    toast.info('Volume lock feature coming soon!')
  }

  const handleOpenVolume = (volume) => {
    dispatch(setCurrentVolume(volume))
  }

  const sortItems = (items) => {
    const sorted = [...items]
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'date':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case 'size':
        return sorted.sort((a, b) => (b.size || 0) - (a.size || 0))
      default:
        return sorted
    }
  }

  const sortedFolders = sortItems(folders)
  const sortedFiles = sortItems(files)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    )
  }

  const allItems = [...sortedFolders, ...sortedFiles]
  const recentItems = allItems.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumb */}
      <div className="flex items-center justify-between">
        <Breadcrumb path={folderPath} currentFolder={currentFolder} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => dispatch(setView('grid'))}
              className={`p-2 rounded-md transition-colors ${
                view === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => dispatch(setView('list'))}
              className={`p-2 rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Title and Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentVolume && (
            <button
              onClick={() => dispatch(setCurrentVolume(null))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Back to volumes"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentVolume ? currentVolume.name : currentFolder ? currentFolder.name : 'My Cloud'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleCreateFolderModal())}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span className="font-medium">New Folder</span>
          </button>
          <button
            onClick={() => dispatch(toggleUploadModal())}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Upload Files</span>
          </button>
        </div>
      </div>

      {/* Storage Volumes - Only show on root and not in a volume */}
      {!currentFolder && !currentVolume && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Storage Volumes</h2>
            <button
              onClick={() => setShowVolumeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <HardDrive className="w-4 h-4" />
              Create Volume
            </button>
          </div>
          
          {volumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volumes.map((volume) => (
                <VolumeCard
                  key={volume.id}
                  volume={volume}
                  onEdit={handleEditVolume}
                  onDelete={handleDeleteVolume}
                  onLock={handleLockVolume}
                  onOpen={handleOpenVolume}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
              <HardDrive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No volumes created yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create storage volumes to organize your files better
              </p>
              <button
                onClick={() => setShowVolumeModal(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Your First Volume
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recent Added Section */}
      {recentItems.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Added</h2>
            <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              See all
            </button>
          </div>

          {/* Table View for Recent Items */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.mimeType ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}>
                          {item.mimeType ? (
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Only me</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(item.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Files and Folders */}
      {(sortedFolders.length > 0 || sortedFiles.length > 0) && (
        <div className="space-y-6">
          {sortedFolders.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
                Folders
              </h3>
              <div className={
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                  : 'space-y-2'
              }>
                {sortedFolders.map((folder) => (
                  <FolderCard key={folder.id} folder={folder} onUpdate={onRefresh} viewMode={view} />
                ))}
              </div>
            </div>
          )}

          {sortedFiles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
                Files
              </h3>
              <div className={
                view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                  : 'space-y-2'
              }>
                {sortedFiles.map((file) => (
                  <FileCard key={file.id} file={file} onUpdate={onRefresh} viewMode={view} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Volume Modal */}
      <CreateVolumeModal
        isOpen={showVolumeModal}
        onClose={() => setShowVolumeModal(false)}
        onCreateVolume={handleCreateVolume}
        totalStorage={totalStorage}
        usedStorage={usedStorage}
      />
    </div>
  )
}

export default MyDrive
