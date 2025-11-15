import { Home, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setCurrentFolder } from '../redux/slices/foldersSlice'
import { useState } from 'react'

const Breadcrumb = ({ path = [], currentFolder }) => {
  const dispatch = useDispatch()
  const [showAll, setShowAll] = useState(false)

  const handleNavigate = (folder) => {
    dispatch(setCurrentFolder(folder))
  }

  // If path is too long, show only first, last and a "..." button
  const shouldCollapse = path.length > 3
  const visiblePath = shouldCollapse && !showAll 
    ? [path[0], '...', path[path.length - 1]]
    : path

  return (
    <nav className="flex items-center gap-1 text-sm overflow-x-auto py-2">
      {/* Home / My Drive */}
      <button
        onClick={() => handleNavigate(null)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          !currentFolder
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
        }`}
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">My Drive</span>
      </button>

      {/* Path segments */}
      {visiblePath.map((item, index) => {
        if (item === '...') {
          return (
            <div key="ellipsis" className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              <button
                onClick={() => setShowAll(!showAll)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title="Show all folders"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          )
        }

        const folder = item
        const isLast = index === visiblePath.length - 1
        const isActive = currentFolder?.id === folder.id

        return (
          <div key={folder.id} className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-600 flex-shrink-0" />
            <button
              onClick={() => handleNavigate(folder)}
              className={`px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {folder.name}
            </button>
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
