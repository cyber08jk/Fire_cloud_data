import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import FileCard from './FileCard'
import { fileService } from '../services/fileService'

function RecentFiles() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)

  const loadRecentFiles = async () => {
    setLoading(true)
    try {
      const response = await fileService.getRecentFiles()
      setFiles(response.data || [])
    } catch (error) {
      console.error('Failed to load recent files:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecentFiles()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Files</h2>

      {files.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No recent files</p>
          <p className="text-gray-400">Files you access will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} onUpdate={loadRecentFiles} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RecentFiles
