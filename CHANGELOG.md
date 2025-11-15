# Changelog

All notable changes to FireBird will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-15

### Added
- 🔐 JWT-based authentication with BCrypt password hashing
- 📁 File upload/download with MongoDB GridFS support
- 📂 Folder hierarchy management with nested folders
- 🔒 Password-protected folders with encryption
- 🌙 Dark mode support with smooth transitions
- 📱 Responsive design for mobile, tablet, and desktop
- ⭐ Star/favorite files and folders
- 🔍 Search functionality across files and folders
- 📊 Storage usage visualization with progress bars
- 💾 Storage volumes for organizing files
- 🖼️ File preview for images, videos, audio, PDFs, and documents
- 📋 Grid and list view options
- 🔔 Real-time notifications with toast messages
- 🗑️ Trash/recycle bin functionality
- 📈 Storage breakdown by file type
- 🎨 Google Drive-inspired modern UI
- 🔄 Drag-and-drop file upload
- 📊 Recent files view
- 🔐 Secure folder lock/unlock with password verification
- 🎯 Breadcrumb navigation
- 📱 Mobile-friendly interface

### Backend Features
- Spring Boot 3.2 REST API
- MongoDB integration with GridFS
- Spring Security with JWT
- File chunking for large files
- Activity logging
- Storage quota management
- CORS configuration
- Error handling and validation
- API documentation with Swagger

### Frontend Features
- React 18 with hooks
- Redux Toolkit for state management
- React Router v6 for routing
- Tailwind CSS for styling
- Axios for API calls
- File upload with progress tracking
- Modal dialogs for actions
- Loading states and error handling
- Persistent dark mode preference
- Local storage for user preferences

### Security
- BCrypt password hashing (12 rounds)
- JWT token authentication
- Password-protected folders
- Secure API endpoints
- Input validation
- XSS protection
- CSRF protection

## [Unreleased]

### Planned Features
- [ ] File sharing with users
- [ ] Public link sharing
- [ ] Real-time collaboration
- [ ] File versioning
- [ ] Advanced search filters
- [ ] Bulk operations
- [ ] Two-factor authentication
- [ ] File encryption at rest
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] File comments
- [ ] Activity timeline
- [ ] Keyboard shortcuts
- [ ] File compression
- [ ] Thumbnail generation
- [ ] Video transcoding
- [ ] OCR for documents
- [ ] Integration with cloud providers

### Known Issues
- File preview may not work for all file types
- Large file uploads (>100MB) may timeout on slow connections
- Dark mode transition may flicker on initial load

## Version History

### [1.0.0] - 2025-11-15
- Initial release
- Core file storage functionality
- User authentication
- Folder management
- Password protection
- Dark mode
- File preview

---

## How to Update

### Backend
```bash
cd firebird-backend
git pull origin main
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd firebird-frontend
git pull origin main
npm install
npm run dev
```

## Migration Notes

### From 0.x to 1.0.0
- No migration needed (initial release)

---

For more details, see the [README.md](README.md) file.
