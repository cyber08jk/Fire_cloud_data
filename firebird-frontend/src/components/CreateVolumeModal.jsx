import { X, HardDrive } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-toastify'

const CreateVolumeModal = ({ isOpen, onClose, onCreateVolume, totalStorage, usedStorage }) => {
  const [volumeName, setVolumeName] = useState('')
  const [volumeSize, setVolumeSize] = useState(5)
  const [selectedColor, setSelectedColor] = useState('bg-indigo-600')

  const colors = [
    { name: 'Indigo', class: 'bg-indigo-600' },
    { name: 'Blue', class: 'bg-blue-600' },
    { name: 'Purple', class: 'bg-purple-600' },
    { name: 'Pink', class: 'bg-pink-600' },
    { name: 'Red', class: 'bg-red-600' },
    { name: 'Orange', class: 'bg-orange-600' },
    { name: 'Green', class: 'bg-green-600' },
    { name: 'Teal', class: 'bg-teal-600' },
  ]

  const availableStorage = (totalStorage - usedStorage) / (1024 * 1024 * 1024)
  const maxSize = Math.floor(availableStorage)

  const handleCreate = () => {
    if (!volumeName.trim()) {
      toast.error('Please enter a volume name')
      return
    }

    if (volumeSize > maxSize) {
      toast.error(`Maximum available storage is ${maxSize} GB`)
      return
    }

    const newVolume = {
      id: Date.now().toString(),
      name: volumeName,
      total: volumeSize * 1024 * 1024 * 1024,
      used: 0,
      fileCount: 0,
      color: selectedColor,
      locked: false,
      createdAt: new Date().toISOString(),
    }

    onCreateVolume(newVolume)
    setVolumeName('')
    setVolumeSize(5)
    setSelectedColor('bg-indigo-600')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Volume</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Volume Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Volume Name
            </label>
            <input
              type="text"
              value={volumeName}
              onChange={(e) => setVolumeName(e.target.value)}
              placeholder="e.g., Work Files, Personal, Projects"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
          </div>

          {/* Volume Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Volume Size (GB)
            </label>
            <input
              type="number"
              value={volumeSize}
              onChange={(e) => setVolumeSize(Math.min(Number(e.target.value), maxSize))}
              min="1"
              max={maxSize}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Available: {maxSize.toFixed(1)} GB
            </p>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Volume Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.class}
                  onClick={() => setSelectedColor(color.class)}
                  className={`h-12 rounded-lg ${color.class} hover:scale-110 transition-transform ${
                    selectedColor === color.class ? 'ring-4 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${selectedColor} rounded-lg flex items-center justify-center`}>
                <HardDrive className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {volumeName || 'Volume Name'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {volumeSize} GB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Create Volume
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateVolumeModal
