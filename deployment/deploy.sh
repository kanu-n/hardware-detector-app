#!/bin/bash

# Hardware Detector Deployment Script

echo "🚀 Hardware Detector Deployment Helper"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root."
    exit 1
fi

echo "📋 Available deployment options:"
echo "1. Vercel (Recommended - Free HTTPS)"
echo "2. Netlify (Free HTTPS)"
echo "3. Build for manual deployment"
echo "4. Preview production build locally"
echo ""

read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        echo "🔧 Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        # Copy Vercel config
        cp deployment/vercel.json ./
        
        echo "🚀 Starting Vercel deployment..."
        vercel --prod
        
        echo "✅ Deployment complete!"
        echo "🌐 Your app is now live with HTTPS"
        echo "📱 All Web APIs (USB, Bluetooth, etc.) will work!"
        ;;
        
    2)
        echo "🔧 Preparing for Netlify deployment..."
        
        # Copy Netlify config
        cp deployment/netlify.toml ./
        
        # Build the project
        echo "📦 Building project..."
        npm run build
        
        echo "✅ Build complete!"
        echo "📁 Upload the '.next' folder to Netlify"
        echo "🌐 Or connect your Git repository to Netlify"
        echo "📱 Your app will have HTTPS and full API support"
        ;;
        
    3)
        echo "📦 Building for production..."
        npm run build
        
        echo "✅ Build complete!"
        echo "📁 Built files are in the '.next' directory"
        echo "🔧 Deploy these files to any HTTPS-enabled hosting service"
        echo "⚠️  Remember: HTTPS is required for USB/Bluetooth APIs"
        ;;
        
    4)
        echo "🔧 Starting production preview..."
        npm run build
        npm start
        
        echo "🌐 Production preview running at http://localhost:3000"
        echo "⚠️  Note: USB/Bluetooth APIs work on localhost even without HTTPS"
        ;;
        
    *)
        echo "❌ Invalid option. Please choose 1-4."
        exit 1
        ;;
esac

echo ""
echo "🧪 After deployment, test these features:"
echo "✅ Audio/Video device detection (works immediately)"
echo "✅ Gaming controller detection"
echo "✅ Storage and network information"
echo "⚠️  USB devices (requires 'Request USB Access' button)"
echo "⚠️  Bluetooth devices (requires 'Request Bluetooth Access' button)"
echo ""
echo "💡 Pro tip: Use Chrome or Edge for best compatibility!"