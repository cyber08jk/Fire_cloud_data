# 🚀 Quick Start Guide

Get FireBird up and running in 5 minutes!

## Prerequisites

Make sure you have these installed:
- ☕ Java 17+
- 📦 Maven 3.6+
- 🟢 Node.js 16+
- 🍃 MongoDB 4.4+

## Option 1: Automated Setup (Recommended)

### Windows
```bash
setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

## Option 2: Manual Setup

### Step 1: Start MongoDB

**Windows:**
```bash
mongod --dbpath C:\data\db
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

### Step 2: Start Backend

```bash
cd firebird-backend
mvn spring-boot:run
```

Wait for the message: `Started FireBirdApplication in X seconds`

### Step 3: Start Frontend

Open a new terminal:

```bash
cd firebird-frontend
npm install
npm run dev
```

### Step 4: Open Application

Open your browser and go to: **http://localhost:5173**

## First Time Setup

1. **Register an Account**
   - Click "Register"
   - Fill in your details
   - Click "Create Account"

2. **Login**
   - Enter your email and password
   - Click "Login"

3. **Start Using FireBird**
   - Upload files by dragging and dropping
   - Create folders to organize
   - Lock folders with passwords
   - Star important files
   - Switch to dark mode

## Common Issues

### MongoDB Connection Error
```
Error: MongoTimeoutError: Server selection timed out
```
**Solution:** Make sure MongoDB is running
```bash
mongod --dbpath C:\data\db
```

### Port Already in Use
```
Error: Port 8080 is already in use
```
**Solution:** Kill the process using port 8080
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### Frontend Not Loading
```
Error: Failed to fetch
```
**Solution:** Make sure backend is running on port 8080

### Java Version Error
```
Error: Unsupported class file major version
```
**Solution:** Install Java 17 or higher

## Default Configuration

- **Backend API:** http://localhost:8080/api
- **Frontend:** http://localhost:5173
- **MongoDB:** mongodb://localhost:27017/firebird
- **Storage Quota:** 15 GB per user

## Next Steps

- 📖 Read the full [README.md](README.md)
- 🔧 Configure [application.properties](firebird-backend/src/main/resources/application.properties)
- 🎨 Customize the UI theme
- 🚀 Deploy to production

## Need Help?

- 📝 Check [README.md](README.md) for detailed documentation
- 🐛 Report issues on GitHub
- 💬 Join our community Discord
- 📧 Email: support@firebird.com

Happy coding! 🔥
