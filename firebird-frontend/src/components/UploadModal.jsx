import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { X, Upload, File } from 'lucide-react'
import { toggleUploadModal } from '../redux/slices/uiSlice'
import { fileService } from '../services/fileService'
import { toast } from 'react-toastify'

function UploadModal({ onUploadComplete }) {
  const dispatch = useDispatch()
  const { showUploadModal } = useSelector((state) => state.ui)
  const { currentFolder } = useSelector((state) => state.folders)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 104857600, // 100MB
  })

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setUploading(true)
    
    try {
      for (const file of selectedFiles) {
        await fileService.uploadFile(file, currentFolder?.id, (prog) => {
          setProgress(prog)
        })
      }
      
      toast.success(`${selectedFiles.length} file(s) uploaded successfully`)
      setSelectedFiles([])
      setProgress(0)
      dispatch(toggleUploadModal())
      onUploadComplete()
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  if (!showUploadModal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Upload Files</h2>
            {currentFolder && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Uploading to: <span className="font-medium text-blue-600 dark:text-blue-400">{currentFolder.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={() => dispatch(toggleUploadModal())}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-blue-600 dark:text-blue-400 font-medium">Drop files here...</p>
          ) : (
            <div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Maximum file size: 100MB</p>
            </div>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <File className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => dispatch(toggleUploadModal())}
            disabled={uploading}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadModal
