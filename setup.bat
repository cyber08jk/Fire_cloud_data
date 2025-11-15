@echo off
echo ========================================
echo FireBird Cloud Storage - Setup Script
echo ========================================
echo.

echo [1/4] Checking prerequisites...
echo.

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed. Please install Java 17 or higher.
    echo Download from: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)
echo [OK] Java is installed

REM Check Maven
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven is not installed. Please install Maven 3.6+
    echo Download from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)
echo [OK] Maven is installed

REM Check Node
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 16+
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed

REM Check MongoDB
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB is not installed or not in PATH
    echo Please install MongoDB from: https://www.mongodb.com/try/download/community
    echo.
)

echo.
echo [2/4] Setting up Backend...
cd firebird-backend
echo Installing backend dependencies...
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Backend setup failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Backend setup complete

echo.
echo [3/4] Setting up Frontend...
cd firebird-frontend
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend setup failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend setup complete

echo.
echo [4/4] Creating environment files...
if not exist "firebird-frontend\.env" (
    echo VITE_API_URL=http://localhost:8080/api > firebird-frontend\.env
    echo [OK] Created frontend .env file
)

echo.
echo ========================================
echo Setup Complete! 
echo ========================================
echo.
echo Next steps:
echo 1. Start MongoDB: mongod --dbpath C:\data\db
echo 2. Start Backend: cd firebird-backend ^&^& mvn spring-boot:run
echo 3. Start Frontend: cd firebird-frontend ^&^& npm run dev
echo 4. Open http://localhost:5173 in your browser
echo.
echo For more information, see README.md
echo.
pause
