# FireBird Backend - Cloud File Storage API

Production-ready Spring Boot backend for FireBird cloud storage application.

## Features

- JWT Authentication with BCrypt password hashing
- MongoDB GridFS for large file storage
- File upload/download with chunking support
- Folder hierarchy management
- File sharing (user-based and public links)
- Search and filtering
- Storage quota management
- Activity logging
- RESTful API with Swagger documentation

## Tech Stack

- Java 17
- Spring Boot 3.2
- MongoDB + GridFS
- Spring Security + JWT
- Maven

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB 4.4+ (running locally or MongoDB Atlas)

## Setup Instructions

1. **Install MongoDB**
   ```bash
   # Windows (using Chocolatey)
   choco install mongodb
   
   # Or download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB**
   ```bash
   mongod --dbpath C:\data\db
   ```

3. **Configure Application**
   - Copy `.env.example` to `.env` and update values
   - Or edit `src/main/resources/application.properties`

4. **Build Project**
   ```bash
   mvn clean install
   ```

5. **Run Application**
   ```bash
   mvn spring-boot:run
   ```

The API will be available at `http://localhost:8080/api`

## API Documentation

Once running, access Swagger UI at:
- http://localhost:8080/api/swagger-ui.html

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files` - List files
- `GET /api/files/{id}` - Get file metadata
- `GET /api/files/{id}/download` - Download file
- `GET /api/files/starred` - Get starred files
- `GET /api/files/recent` - Get recent files
- `GET /api/files/search?q=query` - Search files
- `POST /api/files/{id}/star` - Toggle star
- `PUT /api/files/{id}?name=newname` - Rename file
- `DELETE /api/files/{id}` - Delete file

### Folders
- `POST /api/folders?name=folder` - Create folder
- `GET /api/folders` - List folders
- `GET /api/folders/{id}` - Get folder
- `PUT /api/folders/{id}?name=newname` - Rename folder
- `DELETE /api/folders/{id}` - Delete folder

### Sharing
- `POST /api/share/users` - Share with user
- `POST /api/share/link` - Create public link
- `GET /api/share/received` - Files shared with me
- `GET /api/share/by-me` - Files I've shared
- `DELETE /api/share/{id}` - Remove share

### Storage
- `GET /api/storage/usage` - Get storage usage

## Testing

Run tests:
```bash
mvn test
```

## Deployment

### Build JAR
```bash
mvn clean package
```

### Run JAR
```bash
java -jar target/firebird-backend-1.0.0.jar
```

### Environment Variables for Production
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Strong secret key (256-bit)
- `CORS_ALLOWED_ORIGINS` - Frontend URL

## Security Notes

- Change JWT secret in production
- Use HTTPS in production
- Configure MongoDB authentication
- Set up rate limiting
- Enable CORS only for trusted origins
- Use strong passwords (BCrypt with strength 12)

## License

MIT
