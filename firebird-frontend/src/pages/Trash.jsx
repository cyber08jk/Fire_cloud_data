import { useState } from 'react'
import { Trash2, RotateCcw, X } from 'lucide-react'
import { toast } from 'react-toastify'

function Trash() {
  const [trashedItems, setTrashedItems] = useState([])

  const handleRestore = (item) => {
    toast.success(`${item.name} restored`)
    setTrashedItems(trashedItems.filter(i => i.id !== item.id))
  }

  const handlePermanentDelete = (item) => {
    if (confirm(`Permanently delete "${item.name}"? This cannot be undone.`)) {
      toast.success(`${item.name} permanently deleted`)
      setTrashedItems(trashedItems.filter(i => i.id !== item.id))
    }
  }

  const handleEmptyTrash = () => {
    if (confirm('Empty trash? All items will be permanently deleted.')) {
      setTrashedItems([])
      toast.success('Trash emptied')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recycle Bin</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Items in trash will be permanently deleted after 30 days
          </p>
        </div>
        {trashedItems.length > 0 && (
          <button
            onClick={handleEmptyTrash}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Empty Trash
          </button>
        )}
      </div>

      {trashedItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-20 text-center">
          <Trash2 className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Trash is empty
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Deleted items will appear here
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Deleted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {trashedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-gray-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.deletedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRestore(item)}
                        className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Restore"
                      >
                        <RotateCcw className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete permanently"
                      >
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Trash
