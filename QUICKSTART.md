# Hardware Detector - Quick Start Guide

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

**Linux/Mac:**
```bash
cd /home/hello/Desktop/hardware-detector
./setup.sh
```

**Windows:**
```cmd
cd C:\path\to\hardware-detector
setup.bat
```

### Option 2: Manual Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🖨️ Printer Detection Features

### Supported Detection Methods:
- **USB Printers**: Direct detection via Web USB API
- **Network Printers**: System print dialog access
- **Print Testing**: Test print functionality

### Printer Manufacturers Supported:
- HP (Hewlett-Packard)
- Epson
- Canon
- Samsung
- Brother
- Xerox
- Lexmark
- Ricoh

## 🔌 Hardware Detection Capabilities

| Hardware Type | Detection Method | Requires Permission |
|---------------|------------------|-------------------|
| USB Devices   | Web USB API      | Yes ✅            |
| Bluetooth     | Web Bluetooth API| Yes ✅            |
| Audio/Video   | MediaDevices API | Yes ✅            |
| Gamepads      | Gamepad API      | No ❌             |
| Storage       | Storage API      | No ❌             |
| Network       | Navigator API    | No ❌             |

## 🌐 Browser Requirements

### Fully Supported:
- Chrome 61+
- Edge 79+
- Opera 48+

### Partially Supported:
- Firefox 63+ (limited Web USB support)
- Safari 14+ (limited API support)

## 🔒 Security & Permissions

### Required Permissions:
- **USB Access**: Click "Request USB Access" button
- **Bluetooth Access**: Click "Request Bluetooth Access" button
- **Media Devices**: Automatic prompt when accessing audio/video

### HTTPS Requirement:
- Development: Works on localhost
- Production: Requires HTTPS for full functionality

## 📱 Usage Tips

1. **First Time Setup:**
   - Allow permissions when prompted
   - Test printer access using built-in test feature
   - Use "Refresh Scan" to update device list

2. **Troubleshooting:**
   - If devices not showing: Check browser permissions
   - If printers not detected: Use "Open Print Dialog" for system access
   - If USB devices missing: Click "Request USB Access"

3. **Best Practices:**
   - Use Chrome/Edge for best compatibility
   - Ensure devices are properly connected
   - Allow browser permissions for full detection

## 🛠️ Development

### Project Structure:
```
hardware-detector/
├── app/                 # Next.js app directory
├── components/          # React components
├── utils/              # Utility functions
├── public/             # Static assets
└── ...config files
```

### Key Files:
- `app/page.tsx` - Main application component
- `components/PrinterDetector.tsx` - Specialized printer detection
- `utils/hardwareDetection.ts` - Hardware detection utilities

## 📄 License

This project is open source and available under the MIT License.