import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { File, FileText, Image, Film, Music, Archive, Star, Download, Trash2, Edit, MoreVertical } from 'lucide-react'
import { openPreview } from '../redux/slices/uiSlice'
import { fileService } from '../services/fileService'
import { toast } from 'react-toastify'

function FileCard({ file, onUpdate }) {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState(file.name)

  const handlePreview = () => {
    if (!renaming) {
      console.log('Opening preview for file:', file)
      dispatch(openPreview(file))
    }
  }

  const getFileIcon = () => {
    const type = file.mimeType?.split('/')[0]
    const iconClass = "w-12 h-12"
    
    switch (type) {
      case 'image':
        return <Image className={`${iconClass} text-blue-500`} />
      case 'video':
        return <Film className={`${iconClass} text-purple-500`} />
      case 'audio':
        return <Music className={`${iconClass} text-green-500`} />
      case 'text':
        return <FileText className={`${iconClass} text-gray-500`} />
      case 'application':
        if (file.mimeType?.includes('zip') || file.mimeType?.includes('rar')) {
          return <Archive className={`${iconClass} text-orange-500`} />
        }
        return <File className={`${iconClass} text-gray-400`} />
      default:
        return <File className={`${iconClass} text-gray-400`} />
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
    return (bytes / 1073741824).toFixed(2) + ' GB'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleDownload = async () => {
    try {
      await fileService.downloadFile(file.id, file.name)
      toast.success('Download started')
    } catch (error) {
      toast.error('Download failed')
    }
  }

  const handleToggleStar = async () => {
    try {
      await fileService.toggleStar(file.id)
      toast.success(file.starred ? 'Removed from starred' : 'Added to starred')
      onUpdate()
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  const handleRename = async () => {
    if (!newName.trim() || newName === file.name) {
      setRenaming(false)
      return
    }

    try {
      await fileService.renameFile(file.id, newName)
      toast.success('File renamed')
      setRenaming(false)
      onUpdate()
    } catch (error) {
      toast.error('Rename failed')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Move this file to trash?')) return

    try {
      await fileService.deleteFile(file.id)
      toast.success('File moved to trash')
      onUpdate()
    } catch (error) {
      toast.error('Delete failed')
    }
  }

  return (
    <div 
      onClick={handlePreview}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all relative group cursor-pointer"
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleStar(); }}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Star
            className={`w-4 h-4 ${file.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
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
                onClick={(e) => { e.stopPropagation(); handleDownload(); setShowMenu(false); }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
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
        <div className="mb-3">
          {getFileIcon()}
        </div>
        
        {renaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            className="w-full px-2 py-1 text-sm border border-blue-500 rounded text-center dark:bg-gray-700 dark:text-white"
            autoFocus
          />
        ) : (
          <p className="text-sm font-medium text-gray-900 dark:text-white text-center truncate w-full px-2">
            {file.name}
          </p>
        )}
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{formatSize(file.size)}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(file.createdAt)}</p>
      </div>
    </div>
  )
}

export default FileCard
