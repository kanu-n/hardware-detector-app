@echo off
REM Hardware Detector Setup Script for Windows

echo Setting up Hardware Detector application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 18+ first.
    echo Visit: https://nodejs.org/en/download/
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version

REM Install dependencies
echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo Dependencies installed successfully

REM Create environment file
if not exist ".env" (
    echo Creating environment file...
    copy .env.example .env
    echo Environment file created
)

REM Start development server
echo Starting development server...
echo.
echo The application will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause