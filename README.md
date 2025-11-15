<<<<<<< HEAD
# 🔥 FireBird - Cloud File Storage System

A modern, full-stack cloud storage application inspired by Google Drive, built with **Spring Boot** and **React**. FireBird provides secure file storage, folder management, password-protected folders, file sharing, and a beautiful dark mode interface.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔐 Security & Authentication
- **JWT-based authentication** with BCrypt password hashing (12 rounds)
- **Password-protected folders** with secure encryption
- **Role-based access control**
- **Session management** with token refresh

### 📁 File Management
- **Drag-and-drop file upload** with progress tracking
- **Large file support** using MongoDB GridFS (chunked storage)
- **File preview** for images, videos, audio, PDFs, and documents
- **Download files** with proper content-type handling
- **Rename, delete, and organize** files
- **Star/favorite** files for quick access
- **Recent files** view with sorting

### 📂 Folder Management
- **Nested folder hierarchy** with breadcrumb navigation
- **Create, rename, and delete** folders
- **Password lock/unlock** folders for privacy
- **Folder navigation** with back button support
- **Lock indicator** on protected folders

### 💾 Storage Management
- **Storage volumes** for organizing files
- **Storage usage visualization** with progress bars
- **15GB free storage** per user (configurable)
- **Storage breakdown** by file type
- **Quota management** and warnings

### 🎨 Modern UI/UX
- **Google Drive-inspired design** with clean interface
- **Dark mode support** with smooth transitions
- **Responsive design** (mobile, tablet, desktop)
- **Grid and list view** options
- **Real-time notifications** with toast messages
- **Loading states** and error handling
- **Smooth animations** and transitions

### 🔍 Search & Filter
- **Real-time search** across files and folders
- **Filter by type** (documents, images, videos, etc.)
- **Sort by name, date, or size**
- **Advanced search** capabilities

### 🚀 Additional Features
- **File sharing** (coming soon)
- **Activity logging** for audit trails
- **Trash/recycle bin** with restore functionality
- **Batch operations** on multiple files
- **Keyboard shortcuts** for power users

## 🏗️ Architecture

### Backend (Spring Boot)
```
firebird-backend/
├── src/main/java/com/firebird/
│   ├── controller/          # REST API endpoints
│   │   ├── AuthController.java
│   │   ├── FileController.java
│   │   ├── FolderController.java
│   │   ├── ShareController.java
│   │   └── StorageController.java
│   ├── service/            # Business logic
│   │   ├── AuthService.java
│   │   ├── FileService.java
│   │   ├── FolderService.java
│   │   ├── GridFSService.java
│   │   └── ActivityService.java
│   ├── model/              # Data models
│   │   ├── User.java
│   │   ├── FileMetadata.java
│   │   ├── Folder.java
│   │   └── Share.java
│   ├── security/           # Security configuration
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── UserPrincipal.java
│   ├── config/             # Application configuration
│   │   └── SecurityConfig.java
│   └── dto/                # Data transfer objects
│       └── RegisterRequest.java
└── src/main/resources/
    └── application.properties
```

### Frontend (React)
```
firebird-frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── FileCard.jsx
│   │   ├── FolderCard.jsx
│   │   ├── UploadModal.jsx
│   │   ├── CreateFolderModal.jsx
│   │   ├── PasswordLockModal.jsx
│   │   ├── FilePreviewModal.jsx
│   │   └── VolumeCard.jsx
│   ├── pages/              # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── redux/              # State management
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── filesSlice.js
│   │       ├── foldersSlice.js
│   │       ├── uiSlice.js
│   │       └── volumesSlice.js
│   ├── services/           # API integration
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── fileService.js
│   │   └── folderService.js
│   └── App.jsx
└── package.json
```

## 🛠️ Tech Stack

### Backend
- **Java 17** - Modern Java features
- **Spring Boot 3.2** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data MongoDB** - Database integration
- **MongoDB GridFS** - Large file storage
- **JWT (jjwt 0.12.3)** - Token-based authentication
- **BCrypt** - Password hashing
- **Lombok** - Boilerplate reduction
- **Maven** - Dependency management

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Toastify** - Notifications
- **Vite** - Build tool & dev server

### Database
- **MongoDB 4.4+** - NoSQL database
- **GridFS** - File storage system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.6+** ([Download](https://maven.apache.org/download.cgi))
- **Node.js 16+** and npm ([Download](https://nodejs.org/))
- **MongoDB 4.4+** ([Download](https://www.mongodb.com/try/download/community))

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/firebird.git
cd firebird
```

### 2. Setup MongoDB

**Windows:**
```bash
# Install MongoDB (using Chocolatey)
choco install mongodb

# Create data directory
mkdir C:\data\db

# Start MongoDB
mongod --dbpath C:\data\db
```

**Linux/Mac:**
```bash
# Install MongoDB
sudo apt-get install mongodb  # Ubuntu/Debian
brew install mongodb-community  # macOS

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### 3. Setup Backend

```bash
cd firebird-backend

# Configure application (optional)
# Edit src/main/resources/application.properties

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080/api`

### 4. Setup Frontend

```bash
cd firebird-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 5. Create Your First Account

1. Open `http://localhost:5173` in your browser
2. Click "Register" and create a new account
3. Login with your credentials
4. Start uploading files!

## 📝 Configuration

### Backend Configuration

Edit `firebird-backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/firebird
spring.data.mongodb.database=firebird

# JWT Configuration
jwt.secret=your-256-bit-secret-key-change-this-in-production
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB

# CORS Configuration
cors.allowed.origins=http://localhost:5173
```

### Frontend Configuration

Create `firebird-frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files` - List files
- `GET /api/files/{id}/download` - Download file
- `PUT /api/files/{id}` - Rename file
- `DELETE /api/files/{id}` - Delete file
- `POST /api/files/{id}/star` - Toggle star
- `GET /api/files/starred` - Get starred files
- `GET /api/files/recent` - Get recent files

### Folders
- `POST /api/folders` - Create folder
- `GET /api/folders` - List folders
- `PUT /api/folders/{id}` - Rename folder
- `DELETE /api/folders/{id}` - Delete folder
- `POST /api/folders/{id}/lock` - Lock folder with password
- `POST /api/folders/{id}/unlock` - Unlock folder
- `POST /api/folders/{id}/verify-password` - Verify folder password

### Storage
- `GET /api/storage/usage` - Get storage usage statistics

## 🧪 Testing

### Backend Tests
```bash
cd firebird-backend
mvn test
```

### Frontend Tests
```bash
cd firebird-frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd firebird-backend
mvn clean package
java -jar target/firebird-backend-1.0.0.jar
```

### Frontend
```bash
cd firebird-frontend
npm run build
# Output will be in dist/ folder
```

## 🚢 Deployment

### Backend Deployment Options
- **AWS EC2** - Deploy JAR on EC2 instance
- **Heroku** - Use Heroku Maven plugin
- **Docker** - Containerize with Dockerfile
- **Azure App Service** - Deploy Spring Boot app

### Frontend Deployment Options
- **Vercel** - `vercel --prod`
- **Netlify** - `netlify deploy --prod --dir=dist`
- **AWS S3 + CloudFront** - Static hosting
- **GitHub Pages** - Free hosting

### Database Options
- **MongoDB Atlas** - Managed cloud MongoDB
- **AWS DocumentDB** - MongoDB-compatible service
- **Self-hosted** - On your own server

## 🔒 Security Best Practices

- ✅ Change JWT secret in production
- ✅ Use HTTPS in production
- ✅ Enable MongoDB authentication
- ✅ Set up rate limiting
- ✅ Configure CORS properly
- ✅ Use environment variables for secrets
- ✅ Regular security updates
- ✅ Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Inspired by Google Drive's clean interface
- Built with modern Java and React best practices
- Thanks to the open-source community

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Email: your.email@example.com
- Join our Discord community

## 🗺️ Roadmap

- [ ] File sharing with users and public links
- [ ] Real-time collaboration
- [ ] File versioning
- [ ] Advanced search with filters
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Two-factor authentication
- [ ] File encryption at rest
- [ ] Bulk operations
- [ ] Admin dashboard

---

⭐ **Star this repository if you find it helpful!**

Made with ❤️ using Java Spring Boot and React
=======
# Fire_cloud_data
An online cloud storage system built using Java that allows users to securely upload, store, manage, and download files from anywhere. It supports user authentication, scalable file handling, and a responsive web dashboard, making data access fast, reliable, and secure.
>>>>>>> 737c029058620fce4a4423950a148bf1e8306281
