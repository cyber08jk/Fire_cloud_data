# FireBird Frontend - Cloud Storage UI

Modern React frontend for FireBird cloud storage application with Google Drive-inspired design.

## Features

- User authentication (login/register)
- File upload with drag-and-drop
- Folder hierarchy management
- File/folder operations (rename, delete, star)
- Search functionality
- Recent and starred files views
- Storage usage visualization
- Responsive design (mobile, tablet, desktop)
- Real-time progress tracking for uploads

## Tech Stack

- React 18
- Redux Toolkit (state management)
- React Router v6 (routing)
- Tailwind CSS (styling)
- Axios (API calls)
- Formik + Yup (form validation)
- React Dropzone (file uploads)
- Lucide React (icons)
- React Toastify (notifications)
- Vite (build tool)

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on http://localhost:8080

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:3000

3. **Build for Production**
   ```bash
   npm run build
   ```

   Production files will be in the `dist` folder.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── FileCard.jsx
│   ├── FolderCard.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── UploadModal.jsx
│   └── CreateFolderModal.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── redux/              # Redux store and slices
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       ├── filesSlice.js
│       ├── foldersSlice.js
│       └── uiSlice.js
├── services/           # API service layer
│   ├── api.js
│   ├── authService.js
│   ├── fileService.js
│   ├── folderService.js
│   └── storageService.js
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Features Walkthrough

### Authentication
- Register with email, password, first name, last name
- Login with email and password
- JWT token stored in localStorage
- Auto-redirect on authentication state change

### File Management
- Upload files via drag-and-drop or file picker
- Download files
- Rename files
- Delete files (soft delete to trash)
- Star/unstar files for quick access
- View file metadata (size, date, type)

### Folder Management
- Create nested folders
- Rename folders
- Delete folders (cascading delete)
- Navigate folder hierarchy
- Star/unstar folders

### Search
- Search files by name
- Real-time search results
- Debounced search input

### Storage
- View storage usage (used/total)
- Visual progress bar
- 15GB free quota per user

## Environment Variables

Create `.env` file:
```
VITE_API_URL=http://localhost:8080/api
```

## Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### AWS S3 + CloudFront
```bash
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

## Customization

### Colors
Edit `tailwind.config.js` to change primary colors:
```js
colors: {
  primary: {
    500: '#0ea5e9',  // Change this
    600: '#0284c7',
    700: '#0369a1',
  }
}
```

### API Endpoint
Update proxy in `vite.config.js`:
```js
server: {
  proxy: {
    '/api': 'http://your-backend-url'
  }
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
