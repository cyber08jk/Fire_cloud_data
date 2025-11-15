import { X, Download, Share2, Star, Trash2, ExternalLink, ZoomIn, ZoomOut } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { closePreview } from '../redux/slices/uiSlice'
import { fileService } from '../services/fileService'
import { toast } from 'react-toastify'

const FilePreviewModal = ({ file, isOpen, onUpdate }) => {
  const dispatch = useDispatch()
  const [zoom, setZoom] = useState(100)

  if (!isOpen) return null
  if (!file) {
    console.error('FilePreviewModal: No file provided')
    return null
  }

  const handleClose = () => dispatch(closePreview())

  const handleDownload = async () => {
    try {
      await fileService.downloadFile(file.id, file.name)
      toast.success('Download started')
    } catch (error) {
      toast.error('Download failed')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Move this file to trash?')) {
      try {
        await fileService.deleteFile(file.id)
        toast.success('File moved to trash')
        handleClose()
        if (onUpdate) onUpdate()
      } catch (error) {
        toast.error('Failed to delete file')
      }
    }
  }

  const handleToggleStar = async () => {
    try {
      await fileService.toggleStar(file.id)
      toast.success(file.starred ? 'Removed from starred' : 'Added to starred')
      if (onUpdate) onUpdate()
    } catch (error) {
      toast.error('Failed to update')
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFileUrl = () => {
    return `http://localhost:8080/api/files/${file.id}/download`
  }

  const renderPreview = () => {
    const type = file.mimeType?.split('/')[0]
    const fileUrl = getFileUrl()

    // Images
    if (type === 'image') {
      return (
        <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl p-8 min-h-[400px]">
          <img
            src={fileUrl}
            alt={file.name}
            style={{ transform: `scale(${zoom / 100})` }}
            className="max-w-full max-h-[600px] object-contain rounded-lg shadow-lg transition-transform"
          />
        </div>
      )
    }

    // Videos
    if (type === 'video') {
      return (
        <div className="bg-black rounded-xl overflow-hidden">
          <video
            controls
            className="w-full max-h-[600px]"
            src={fileUrl}
          >
            Your browser does not support video playback.
          </video>
        </div>
      )
    }

    // Audio
    if (type === 'audio') {
      return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-12 min-h-[400px]">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-8">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
            </svg>
          </div>
          <audio controls className="w-full max-w-md">
            <source src={fileUrl} type={file.mimeType} />
            Your browser does not support audio playback.
          </audio>
        </div>
      )
    }

    // PDFs
    if (file.mimeType === 'application/pdf') {
      return (
        <div className="bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden">
          <iframe
            src={fileUrl}
            className="w-full h-[600px]"
            title={file.name}
          />
        </div>
      )
    }

    // Text files
    if (type === 'text' || file.mimeType?.includes('json') || file.mimeType?.includes('xml')) {
      return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 min-h-[400px]">
          <iframe
            src={fileUrl}
            className="w-full h-[500px] bg-white dark:bg-gray-800 rounded-lg"
            title={file.name}
          />
        </div>
      )
    }

    // Office documents (Word, Excel, PowerPoint)
    if (
      file.mimeType?.includes('word') ||
      file.mimeType?.includes('excel') ||
      file.mimeType?.includes('powerpoint') ||
      file.mimeType?.includes('spreadsheet') ||
      file.mimeType?.includes('presentation')
    ) {
      return (
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl p-12 min-h-[400px]">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Office Document
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">
            Preview not available for this file type.<br />
            Download to view in your application.
          </p>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download File
          </button>
        </div>
      )
    }

    // Default - No preview available
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl p-12 min-h-[400px]">
        <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Preview Available
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Download the file to view it
        </p>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download File
        </button>
      </div>
    )
  }

  const isImage = file.mimeType?.split('/')[0] === 'image'

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
              {file.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatSize(file.size)} • {file.mimeType}
            </p>
          </div>

          {/* Zoom controls for images */}
          {isImage && (
            <div className="flex items-center gap-2 mx-4">
              <button
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          )}

          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderPreview()}

          {/* File Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mt-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Size</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {formatSize(file.size)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
              <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                {file.mimeType || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {formatDate(file.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Modified</p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {formatDate(file.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStar}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Star className={`w-4 h-4 ${file.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600 dark:text-gray-400'}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {file.starred ? 'Starred' : 'Star'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(getFileUrl(), '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilePreviewModal
