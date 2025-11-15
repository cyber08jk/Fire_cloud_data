#!/bin/bash

echo "========================================"
echo "FireBird Cloud Storage - Setup Script"
echo "========================================"
echo ""

echo "[1/4] Checking prerequisites..."
echo ""

# Check Java
if ! command -v java &> /dev/null; then
    echo "[ERROR] Java is not installed. Please install Java 17 or higher."
    echo "Download from: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi
echo "[OK] Java is installed"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo "[ERROR] Maven is not installed. Please install Maven 3.6+"
    echo "Download from: https://maven.apache.org/download.cgi"
    exit 1
fi
echo "[OK] Maven is installed"

# Check Node
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Please install Node.js 16+"
    echo "Download from: https://nodejs.org/"
    exit 1
fi
echo "[OK] Node.js is installed"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "[WARNING] MongoDB is not installed or not in PATH"
    echo "Please install MongoDB from: https://www.mongodb.com/try/download/community"
    echo ""
fi

echo ""
echo "[2/4] Setting up Backend..."
cd firebird-backend
echo "Installing backend dependencies..."
mvn clean install -DskipTests
if [ $? -ne 0 ]; then
    echo "[ERROR] Backend setup failed"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Backend setup complete"

echo ""
echo "[3/4] Setting up Frontend..."
cd firebird-frontend
echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Frontend setup failed"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Frontend setup complete"

echo ""
echo "[4/4] Creating environment files..."
if [ ! -f "firebird-frontend/.env" ]; then
    echo "VITE_API_URL=http://localhost:8080/api" > firebird-frontend/.env
    echo "[OK] Created frontend .env file"
fi

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Start MongoDB: sudo systemctl start mongod (or brew services start mongodb-community)"
echo "2. Start Backend: cd firebird-backend && mvn spring-boot:run"
echo "3. Start Frontend: cd firebird-frontend && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "For more information, see README.md"
echo ""
