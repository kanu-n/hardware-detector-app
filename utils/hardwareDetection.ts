// Hardware detection utilities

export interface HardwareDevice {
  id: string
  name: string
  type: 'printer' | 'usb' | 'bluetooth' | 'audio' | 'video' | 'gamepad' | 'storage' | 'network'
  status: 'connected' | 'disconnected' | 'unknown'
  details?: string
  vendorId?: number
  productId?: number
}

// Common printer manufacturer vendor IDs
export const PRINTER_VENDOR_IDS = {
  HP: 0x03F0,
  EPSON: 0x04B8,
  CANON: 0x04A9,
  SAMSUNG: 0x04E8,
  BROTHER: 0x067B,
  XEROX: 0x0924,
  LEXMARK: 0x043D,
  RICOH: 0x05CA
}

// Check if a device is likely a printer based on vendor ID
export const isPrinterDevice = (vendorId: number): boolean => {
  return Object.values(PRINTER_VENDOR_IDS).includes(vendorId)
}

// Get printer manufacturer name from vendor ID
export const getPrinterManufacturer = (vendorId: number): string => {
  const manufacturer = Object.entries(PRINTER_VENDOR_IDS).find(
    ([, id]) => id === vendorId
  )
  return manufacturer ? manufacturer[0] : 'Unknown'
}

// Enhanced USB device detection
export const detectUSBDevices = async (): Promise<HardwareDevice[]> => {
  try {
    if (!('usb' in navigator)) {
      throw new Error('Web USB API not supported')
    }

    const devices = await (navigator as any).usb.getDevices()
    return devices.map((device: any, index: number) => {
      const isPrinter = isPrinterDevice(device.vendorId)
      const manufacturer = isPrinter ? getPrinterManufacturer(device.vendorId) : 'Unknown'
      
      return {
        id: `usb-${device.vendorId}-${device.productId}-${index}`,
        name: device.productName || `${isPrinter ? manufacturer + ' Printer' : 'USB Device'} ${index + 1}`,
        type: isPrinter ? 'printer' : 'usb',
        status: 'connected',
        details: `Vendor: 0x${device.vendorId.toString(16).toUpperCase()}, Product: 0x${device.productId.toString(16).toUpperCase()}${isPrinter ? ` (${manufacturer})` : ''}`,
        vendorId: device.vendorId,
        productId: device.productId
      } as HardwareDevice
    })
  } catch (error) {
    console.warn('USB device detection failed:', error)
    return []
  }
}

// Request USB device access with printer filtering
export const requestUSBAccess = async (printerOnly: boolean = false): Promise<void> => {
  try {
    if (!('usb' in navigator)) {
      throw new Error('Web USB API not supported')
    }

    const filters = printerOnly 
      ? Object.values(PRINTER_VENDOR_IDS).map(vendorId => ({ vendorId }))
      : []

    await (navigator as any).usb.requestDevice({ 
      filters: filters.length > 0 ? filters : undefined 
    })
  } catch (error) {
    console.warn('USB access request failed:', error)
    throw error
  }
}
// Enhanced Bluetooth device detection
export const detectBluetoothDevices = async (): Promise<HardwareDevice[]> => {
  try {
    if (!('bluetooth' in navigator)) {
      throw new Error('Web Bluetooth API not supported')
    }

    // Note: This requires user interaction to work properly
    // We return empty array for now since requesting devices requires user gesture
    return []
  } catch (error) {
    console.warn('Bluetooth device detection failed:', error)
    return []
  }
}

// Enhanced audio device detection
export const detectAudioDevices = async (): Promise<HardwareDevice[]> => {
  try {
    if (!navigator.mediaDevices?.enumerateDevices) {
      throw new Error('MediaDevices API not supported')
    }

    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices
      .filter(device => device.kind === 'audioinput' || device.kind === 'audiooutput')
      .map((device, index) => ({
        id: device.deviceId || `audio-${index}`,
        name: device.label || `${device.kind === 'audioinput' ? 'Microphone' : 'Speaker'} ${index + 1}`,
        type: 'audio',
        status: 'connected',
        details: `Type: ${device.kind === 'audioinput' ? 'Input' : 'Output'}, Group: ${device.groupId || 'Unknown'}`
      } as HardwareDevice))
  } catch (error) {
    console.warn('Audio device detection failed:', error)
    return []
  }
}

// Enhanced video device detection
export const detectVideoDevices = async (): Promise<HardwareDevice[]> => {
  try {
    if (!navigator.mediaDevices?.enumerateDevices) {
      throw new Error('MediaDevices API not supported')
    }

    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices
      .filter(device => device.kind === 'videoinput')
      .map((device, index) => ({
        id: device.deviceId || `video-${index}`,
        name: device.label || `Camera ${index + 1}`,
        type: 'video',
        status: 'connected',
        details: `Video input device, Group: ${device.groupId || 'Unknown'}`
      } as HardwareDevice))
  } catch (error) {
    console.warn('Video device detection failed:', error)
    return []
  }
}

// Enhanced gamepad detection
export const detectGamepads = (): HardwareDevice[] => {
  try {
    if (!('getGamepads' in navigator)) {
      throw new Error('Gamepad API not supported')
    }

    const gamepads = navigator.getGamepads()
    return Array.from(gamepads)
      .filter(gamepad => gamepad !== null)
      .map((gamepad, index) => ({
        id: `gamepad-${gamepad!.index}`,
        name: gamepad!.id || `Gamepad ${index + 1}`,
        type: 'gamepad',
        status: gamepad!.connected ? 'connected' : 'disconnected',
        details: `Index: ${gamepad!.index}, Buttons: ${gamepad!.buttons.length}, Axes: ${gamepad!.axes.length}, Timestamp: ${gamepad!.timestamp}`
      } as HardwareDevice))
  } catch (error) {
    console.warn('Gamepad detection failed:', error)
    return []
  }
}

// Format bytes to human readable format
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
// Enhanced storage detection
export const detectStorageDevices = async (): Promise<HardwareDevice[]> => {
  try {
    if (!('storage' in navigator) || !('estimate' in (navigator as any).storage)) {
      throw new Error('Storage API not supported')
    }

    const estimate = await (navigator as any).storage.estimate()
    const used = estimate.usage || 0
    const quota = estimate.quota || 0
    const usagePercentage = quota > 0 ? ((used / quota) * 100).toFixed(1) : '0'

    return [{
      id: 'storage-main',
      name: 'Browser Storage',
      type: 'storage',
      status: 'connected',
      details: `Used: ${formatBytes(used)} of ${formatBytes(quota)} (${usagePercentage}%)`
    }]
  } catch (error) {
    console.warn('Storage detection failed:', error)
    return []
  }
}

// Enhanced network detection
export const detectNetworkDevices = (): HardwareDevice[] => {
  try {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    
    const baseDevice: HardwareDevice = {
      id: 'network-main',
      name: 'Network Connection',
      type: 'network',
      status: navigator.onLine ? 'connected' : 'disconnected',
      details: 'Basic connectivity status'
    }

    if (connection) {
      const effectiveType = connection.effectiveType || 'unknown'
      const downlink = connection.downlink || 0
      const rtt = connection.rtt || 0
      const saveData = connection.saveData || false

      baseDevice.details = `Type: ${effectiveType}, Speed: ${downlink} Mbps, RTT: ${rtt}ms${saveData ? ', Data Saver: ON' : ''}`
    }

    return [baseDevice]
  } catch (error) {
    console.warn('Network detection failed:', error)
    return [{
      id: 'network-basic',
      name: 'Network Connection',
      type: 'network',
      status: navigator.onLine ? 'connected' : 'disconnected',
      details: 'Basic connectivity check only'
    }]
  }
}

// Comprehensive device scan
export const scanAllDevices = async (): Promise<HardwareDevice[]> => {
  try {
    const [
      usbDevices,
      bluetoothDevices,
      audioDevices,
      videoDevices,
      gamepads,
      storageDevices,
      networkDevices
    ] = await Promise.all([
      detectUSBDevices(),
      detectBluetoothDevices(),
      detectAudioDevices(),
      detectVideoDevices(),
      Promise.resolve(detectGamepads()),
      detectStorageDevices(),
      Promise.resolve(detectNetworkDevices())
    ])

    return [
      ...usbDevices,
      ...bluetoothDevices,
      ...audioDevices,
      ...videoDevices,
      ...gamepads,
      ...storageDevices,
      ...networkDevices
    ]
  } catch (error) {
    console.error('Device scan failed:', error)
    return []
  }
}

// Check Web API support
export const checkAPISupport = () => {
  return {
    webUSB: 'usb' in navigator,
    webBluetooth: 'bluetooth' in navigator,
    mediaDevices: 'mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices,
    gamepad: 'getGamepads' in navigator,
    storage: 'storage' in navigator && 'estimate' in (navigator as any).storage,
    networkInformation: 'connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator
  }
}