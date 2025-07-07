# hardware-detector-app
# Hardware Detector

A Next.js 15 application that detects printers and hardware devices connected to your local machine using Web APIs.

## Features

- **Printer Detection**: Detect USB printers and provide access to system printers
- **USB Device Detection**: Discover connected USB devices (requires permission)
- **Bluetooth Device Detection**: Find nearby Bluetooth devices (requires permission)
- **Audio/Video Devices**: Detect microphones, speakers, and cameras
- **Gamepad Detection**: Real-time gamepad connection monitoring
- **Storage Information**: Display storage usage and quota
- **Network Status**: Monitor network connectivity and speed
- **Real-time Updates**: Automatic updates when devices connect/disconnect

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A modern web browser with Web API support

### Installation

1. Navigate to the project directory:
```bash
cd /home/hello/Desktop/hardware-detector
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Web API Support

This application uses several Web APIs that may require user permission:

- **Web USB API**: For USB device detection
- **Web Bluetooth API**: For Bluetooth device discovery  
- **MediaDevices API**: For audio/video device enumeration
- **Gamepad API**: For controller detection
- **Storage API**: For storage information
- **Network Information API**: For connection details

## Browser Compatibility

- Chrome 61+
- Edge 79+
- Firefox 63+ (limited support)
- Safari 14+ (limited support)

## Security Notes

- Device access requires explicit user permission
- Some APIs only work over HTTPS in production
- Browser security policies limit hardware access for privacy protection

## Limitations

- Full printer enumeration is not possible in web browsers
- Some devices may not be detectable without specific drivers
- USB/Bluetooth access requires user interaction
- API availability varies by browser and platform

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Web APIs (USB, Bluetooth, MediaDevices, etc.)
