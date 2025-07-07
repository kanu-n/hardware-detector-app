'use client'

import { useState, useEffect } from 'react'
import { Monitor, Printer, Usb, Bluetooth, Volume2, Camera, Gamepad2, HardDrive, Wifi, RefreshCw } from 'lucide-react'

interface HardwareDevice {
  id: string
  name: string
  type: 'printer' | 'usb' | 'bluetooth' | 'audio' | 'video' | 'gamepad' | 'storage' | 'network'
  status: 'connected' | 'disconnected' | 'unknown'
  details?: string
}

const HardwareDetector = () => {
  const [devices, setDevices] = useState<HardwareDevice[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState<Date | null>(null)

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'printer': return <Printer className="w-6 h-6" />
      case 'usb': return <Usb className="w-6 h-6" />
      case 'bluetooth': return <Bluetooth className="w-6 h-6" />
      case 'audio': return <Volume2 className="w-6 h-6" />
      case 'video': return <Camera className="w-6 h-6" />
      case 'gamepad': return <Gamepad2 className="w-6 h-6" />
      case 'storage': return <HardDrive className="w-6 h-6" />
      case 'network': return <Wifi className="w-6 h-6" />
      default: return <Monitor className="w-6 h-6" />
    }
  }

  const detectUSBDevices = async (): Promise<HardwareDevice[]> => {
    try {
      if ('usb' in navigator) {
        const devices = await (navigator as any).usb.getDevices()
        return devices.map((device: any, index: number) => ({
          id: `usb-${index}`,
          name: device.productName || `USB Device ${index + 1}`,
          type: 'usb' as const,
          status: 'connected' as const,
          details: `Vendor: ${device.vendorId}, Product: ${device.productId}`
        }))
      }
    } catch (error) {
      console.log('USB API not available or permission denied')
    }
    return []
  }

  const detectBluetoothDevices = async (): Promise<HardwareDevice[]> => {
    try {
      if ('bluetooth' in navigator) {
        // Note: This requires user interaction to work
        return [] // We'll show placeholder for now
      }
    } catch (error) {
      console.log('Bluetooth API not available')
    }
    return []
  }
  const detectAudioDevices = async (): Promise<HardwareDevice[]> => {
    try {
      if ('mediaDevices' in navigator) {
        const devices = await navigator.mediaDevices.enumerateDevices()
        return devices
          .filter(device => device.kind === 'audioinput' || device.kind === 'audiooutput')
          .map((device, index) => ({
            id: device.deviceId || `audio-${index}`,
            name: device.label || `Audio Device ${index + 1}`,
            type: 'audio' as const,
            status: 'connected' as const,
            details: `Type: ${device.kind}`
          }))
      }
    } catch (error) {
      console.log('Media Devices API not available')
    }
    return []
  }

  const detectVideoDevices = async (): Promise<HardwareDevice[]> => {
    try {
      if ('mediaDevices' in navigator) {
        const devices = await navigator.mediaDevices.enumerateDevices()
        return devices
          .filter(device => device.kind === 'videoinput')
          .map((device, index) => ({
            id: device.deviceId || `video-${index}`,
            name: device.label || `Camera ${index + 1}`,
            type: 'video' as const,
            status: 'connected' as const,
            details: 'Video input device'
          }))
      }
    } catch (error) {
      console.log('Video devices not available')
    }
    return []
  }

  const detectGamepads = (): HardwareDevice[] => {
    try {
      if ('getGamepads' in navigator) {
        const gamepads = navigator.getGamepads()
        return Array.from(gamepads)
          .filter(gamepad => gamepad !== null)
          .map((gamepad, index) => ({
            id: `gamepad-${index}`,
            name: gamepad!.id || `Gamepad ${index + 1}`,
            type: 'gamepad' as const,
            status: gamepad!.connected ? 'connected' as const : 'disconnected' as const,
            details: `Buttons: ${gamepad!.buttons.length}, Axes: ${gamepad!.axes.length}`
          }))
      }
    } catch (error) {
      console.log('Gamepad API not available')
    }
    return []
  }
  const detectStorageDevices = async (): Promise<HardwareDevice[]> => {
    try {
      if ('storage' in navigator && 'estimate' in (navigator as any).storage) {
        const estimate = await (navigator as any).storage.estimate()
        return [{
          id: 'storage-main',
          name: 'Primary Storage',
          type: 'storage' as const,
          status: 'connected' as const,
          details: `Used: ${(estimate.usage / 1024 / 1024 / 1024).toFixed(2)} GB, Quota: ${(estimate.quota / 1024 / 1024 / 1024).toFixed(2)} GB`
        }]
      }
    } catch (error) {
      console.log('Storage API not available')
    }
    return []
  }

  const detectNetworkDevices = (): HardwareDevice[] => {
    try {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        return [{
          id: 'network-main',
          name: 'Network Connection',
          type: 'network' as const,
          status: navigator.onLine ? 'connected' as const : 'disconnected' as const,
          details: connection ? `Type: ${connection.effectiveType || 'Unknown'}, Speed: ${connection.downlink || 'Unknown'} Mbps` : 'Network information unavailable'
        }]
      }
    } catch (error) {
      console.log('Network Information API not available')
    }
    return [{
      id: 'network-basic',
      name: 'Network Connection',
      type: 'network' as const,
      status: navigator.onLine ? 'connected' as const : 'disconnected' as const,
      details: 'Basic connectivity check'
    }]
  }

  const detectPrinters = async (): Promise<HardwareDevice[]> => {
    // Printer detection is limited in web browsers
    // We can try to detect USB printers or use the Print API
    const printers: HardwareDevice[] = []
    
    try {
      // Check if Web USB can detect printer-like devices
      if ('usb' in navigator) {
        const devices = await (navigator as any).usb.getDevices()
        const printerDevices = devices.filter((device: any) => {
          // Common printer vendor IDs (this is a simplified check)
          const printerVendors = [0x03F0, 0x04B8, 0x04A9, 0x04E8, 0x067B, 0x0924]
          return printerVendors.includes(device.vendorId)
        })
        
        printerDevices.forEach((device: any, index: number) => {
          printers.push({
            id: `printer-usb-${index}`,
            name: device.productName || `USB Printer ${index + 1}`,
            type: 'printer',
            status: 'connected',
            details: `USB Printer - Vendor: ${device.vendorId}`
          })
        })
      }
    } catch (error) {
      console.log('Could not detect USB printers')
    }

    // Add a generic system printer entry
    printers.push({
      id: 'printer-system',
      name: 'System Printers',
      type: 'printer',
      status: 'unknown',
      details: 'Use browser print dialog to access available printers'
    })

    return printers
  }
  const scanForDevices = async () => {
    setIsScanning(true)
    try {
      const [
        usbDevices,
        bluetoothDevices,
        audioDevices,
        videoDevices,
        gamepads,
        storageDevices,
        networkDevices,
        printers
      ] = await Promise.all([
        detectUSBDevices(),
        detectBluetoothDevices(),
        detectAudioDevices(),
        detectVideoDevices(),
        Promise.resolve(detectGamepads()),
        detectStorageDevices(),
        Promise.resolve(detectNetworkDevices()),
        detectPrinters()
      ])

      const allDevices = [
        ...printers,
        ...usbDevices,
        ...bluetoothDevices,
        ...audioDevices,
        ...videoDevices,
        ...gamepads,
        ...storageDevices,
        ...networkDevices
      ]

      setDevices(allDevices)
      setLastScan(new Date())
    } catch (error) {
      console.error('Error scanning for devices:', error)
    } finally {
      setIsScanning(false)
    }
  }

  useEffect(() => {
    scanForDevices()

    // Listen for gamepad connections
    const handleGamepadConnected = () => {
      scanForDevices()
    }

    window.addEventListener('gamepadconnected', handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', handleGamepadConnected)

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected)
      window.removeEventListener('gamepaddisconnected', handleGamepadConnected)
    }
  }, [])
  const requestUSBAccess = async () => {
    try {
      if ('usb' in navigator) {
        await (navigator as any).usb.requestDevice({ filters: [] })
        scanForDevices()
      }
    } catch (error) {
      console.log('USB access denied or cancelled')
    }
  }

  const requestBluetoothAccess = async () => {
    try {
      if ('bluetooth' in navigator) {
        await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: []
        })
        scanForDevices()
      }
    } catch (error) {
      console.log('Bluetooth access denied or cancelled')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Hardware Detector
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Detect printers and hardware devices connected to your local machine
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={scanForDevices}
              disabled={isScanning}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Refresh Scan'}
            </button>
            
            <button
              onClick={requestUSBAccess}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Usb className="w-4 h-4 mr-2" />
              Request USB Access
            </button>
            
            <button
              onClick={requestBluetoothAccess}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Bluetooth className="w-4 h-4 mr-2" />
              Request Bluetooth Access
            </button>
          </div>

          {lastScan && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last scan: {lastScan.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No devices detected
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Click &quot;Refresh Scan&quot; to detect connected hardware
              </p>
            </div>
          ) : (
            devices.map((device) => (
              <div key={device.id} className="hardware-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600 dark:text-blue-400">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {device.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {device.type}
                      </p>
                    </div>
                  </div>
                  <span className={`status-indicator status-${device.status}`}>
                    {device.status}
                  </span>
                </div>
                
                {device.details && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {device.details}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Important Notes
          </h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Web browsers have limited access to hardware for security reasons</li>
            <li>• Some devices require explicit user permission to be detected</li>
            <li>• Printer detection is limited - use system print dialog for full printer access</li>
            <li>• USB/Bluetooth devices need permission grants to be fully detected</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return <HardwareDetector />
}