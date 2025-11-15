import { Image, FileText, Film, File, Music, Archive } from 'lucide-react'
import { useSelector } from 'react-redux'

const StorageBreakdown = ({ totalStorage = 16106127360 }) => {
  const { files } = useSelector((state) => state.files)

  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }

  // Calculate real storage usage by file type
  const calculateCategoryStorage = () => {
    const categories = {
      images: { name: 'Images', size: 0, icon: Image, color: 'bg-blue-500' },
      documents: { name: 'Documents', size: 0, icon: FileText, color: 'bg-cyan-500' },
      videos: { name: 'Videos', size: 0, icon: Film, color: 'bg-red-500' },
      audio: { name: 'Audio', size: 0, icon: Music, color: 'bg-green-500' },
      archives: { name: 'Archives', size: 0, icon: Archive, color: 'bg-orange-500' },
      other: { name: 'Other Files', size: 0, icon: File, color: 'bg-gray-500' },
    }

    files.forEach(file => {
      const type = file.mimeType?.split('/')[0]
      const size = file.size || 0

      if (type === 'image') {
        categories.images.size += size
      } else if (type === 'video') {
        categories.videos.size += size
      } else if (type === 'audio') {
        categories.audio.size += size
      } else if (file.mimeType?.includes('pdf') || file.mimeType?.includes('document') || file.mimeType?.includes('text')) {
        categories.documents.size += size
      } else if (file.mimeType?.includes('zip') || file.mimeType?.includes('rar') || file.mimeType?.includes('compressed')) {
        categories.archives.size += size
      } else {
        categories.other.size += size
      }
    })

    return Object.values(categories).filter(cat => cat.size > 0)
  }

  const categories = calculateCategoryStorage()
  const usedStorage = files.reduce((total, file) => total + (file.size || 0), 0)
  const percentage = (usedStorage / totalStorage) * 100

  return (
    <div className="space-y-6">
      {/* Storage Circle */}
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - percentage / 100)}`}
              className="text-orange-500 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{formatSize(usedStorage)}</span>
            <span className="text-xs text-gray-400">of {formatSize(totalStorage)}</span>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {categories.length > 0 ? (
          categories.map((category) => {
            const Icon = category.icon
            return (
              <div
                key={category.name}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${category.color} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{category.name}</p>
                    <p className="text-xs text-gray-400">{(category.size / (1024 * 1024)).toFixed(0)} MB</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-white">{formatSize(category.size)}</span>
              </div>
            )
          })
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">No files yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StorageBreakdown
