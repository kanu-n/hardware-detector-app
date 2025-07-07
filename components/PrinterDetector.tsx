"use client"

import { useState } from 'react'
import { Printer, AlertCircle, CheckCircle } from 'lucide-react'

interface PrinterInfo {
  name: string
  status: 'available' | 'offline' | 'unknown'
  isDefault?: boolean
}

const PrinterDetector = () => {
  const [printers, setPrinters] = useState<PrinterInfo[]>([])
  const [isDetecting, setIsDetecting] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)

  const testPrintAccess = async () => {
    setIsDetecting(true)
    try {
      // Create a hidden iframe to test print capabilities
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)

      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(`
          <html>
            <head><title>Printer Test</title></head>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Hardware Detector - Printer Test</h2>
              <p>This is a test page to verify printer connectivity.</p>
              <p>If you can see this in your print preview, your printers are accessible.</p>
              <p>Generated on: ${new Date().toLocaleString()}</p>
            </body>
          </html>
        `)
        doc.close()

        // Attempt to open print dialog
        iframe.contentWindow?.print()
        
        // Simulate printer detection (in real scenario, this would be more sophisticated)
        setTimeout(() => {
          setPrinters([
            { name: 'Default System Printer', status: 'unknown', isDefault: true },
            { name: 'Available Network Printers', status: 'unknown' }
          ])
          setIsDetecting(false)
        }, 2000)
      }

      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 3000)

    } catch (error) {
      console.error('Print test failed:', error)
      setIsDetecting(false)
    }
  }

  const openSystemPrintDialog = () => {
    window.print()
    setShowPrintDialog(true)
    setTimeout(() => setShowPrintDialog(false), 3000)
  }

  return (
    <div className="hardware-card">
      <div className="flex items-center space-x-3 mb-4">
        <Printer className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Printer Detection
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-3">
          <button
            onClick={testPrintAccess}
            disabled={isDetecting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isDetecting ? 'Testing...' : 'Test Print Access'}
          </button>

          <button
            onClick={openSystemPrintDialog}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Open Print Dialog
          </button>
        </div>

        {showPrintDialog && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800 dark:text-green-200">
                Print dialog opened - check your browser&apos;s print preview for available printers
              </span>
            </div>
          </div>
        )}

        {printers.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 dark:text-white">Detected Printers:</h4>
            {printers.map((printer, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {printer.name} {printer.isDefault && '(Default)'}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  printer.status === 'available' ? 'bg-green-100 text-green-800' :
                  printer.status === 'offline' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {printer.status}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Browser Printer Limitations:</p>
              <ul className="text-xs space-y-1">
                <li>• Web browsers cannot directly enumerate system printers</li>
                <li>• Use the print dialog to access all available printers</li>
                <li>• Network printers may require additional setup</li>
                <li>• Some printers may only be visible during print operations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrinterDetector