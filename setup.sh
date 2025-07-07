#!/bin/bash

# Hardware Detector Setup Script
echo "🔧 Setting up Hardware Detector application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/en/download/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create environment file
if [ ! -f ".env" ]; then
    echo "🔧 Creating environment file..."
    cp .env.example .env
    echo "✅ Environment file created"
fi

# Run development server
echo "🚀 Starting development server..."
echo ""
echo "The application will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev