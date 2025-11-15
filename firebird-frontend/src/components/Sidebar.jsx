import { Home, Users, Star, Trash2, HelpCircle, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import StorageBreakdown from './StorageBreakdown'

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'My Cloud' },
    { path: '/shared', icon: Users, label: 'Shared file' },
    { path: '/starred', icon: Star, label: 'Starred' },
    { path: '/trash', icon: Trash2, label: 'Recycle bin' },
  ]

  const bottomItems = [
    { path: '/help', icon: HelpCircle, label: 'Help' },
    { path: '/settings', icon: Settings, label: 'Setting' },
  ]

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-gray-900 border-r border-gray-800 flex flex-col h-screen transition-all duration-300`}>
      {/* Logo and Toggle */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold text-white">FireBird</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
              title={collapsed ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          )
        })}

        <div className="pt-6">
          {bottomItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                title={collapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Storage Breakdown - Only show when not collapsed */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <StorageBreakdown />
        </div>
      )}
    </aside>
  )
}

export default Sidebar
