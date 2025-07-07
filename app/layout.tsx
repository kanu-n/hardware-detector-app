import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hardware Detector',
  description: 'Detect printers and hardware connected to your local machine',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {children}
      </body>
    </html>
  )
}