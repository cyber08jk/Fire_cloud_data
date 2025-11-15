import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import MyDrive from '../components/MyDrive'
import StarredFiles from '../components/StarredFiles'
import RecentFiles from '../components/RecentFiles'
import Trash from './Trash'
import UploadModal from '../components/UploadModal'
import CreateFolderModal from '../components/CreateFolderModal'
import FilePreviewModal from '../components/FilePreviewModal'
import { fileService } from '../services/fileService'
import { folderService } from '../services/folderService'
import { setFiles } from '../redux/slices/filesSlice'
import { setFolders } from '../redux/slices/foldersSlice'

function Dashboard() {
  const dispatch = useDispatch()
  const { currentFolder } = useSelector((state) => state.folders)
  const { previewFile, previewOpen } = useSelector((state) => state.ui)
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [filesRes, foldersRes] = await Promise.all([
        fileService.listFiles(currentFolder?.id),
        folderService.listFolders(currentFolder?.id),
      ])
      
      dispatch(setFiles(filesRes.data || []))
      dispatch(setFolders(foldersRes.data || []))
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentFolder])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onRefresh={loadData} />
        
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={<MyDrive loading={loading} onRefresh={loadData} />} />
            <Route path="/starred" element={<StarredFiles />} />
            <Route path="/recent" element={<RecentFiles />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/shared" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shared Files</h2><p className="text-gray-500 dark:text-gray-400 mt-2">Coming soon</p></div>} />
            <Route path="/help" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Help Center</h2><p className="text-gray-500 dark:text-gray-400 mt-2">Coming soon</p></div>} />
            <Route path="/settings" element={<div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2><p className="text-gray-500 dark:text-gray-400 mt-2">Coming soon</p></div>} />
          </Routes>
        </main>
      </div>

      <UploadModal onUploadComplete={loadData} />
      <CreateFolderModal onFolderCreated={loadData} />
      <FilePreviewModal file={previewFile} isOpen={previewOpen} onUpdate={loadData} />
    </div>
  )
}

export default Dashboard
