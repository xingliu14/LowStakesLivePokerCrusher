import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Low Stakes Live Poker Crusher',
  description: 'Make optimal poker decisions with AI-powered strategy recommendations',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Poker Crusher',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a472a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen">
          <header className="bg-poker-green/80 border-b border-white/10 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white">
                  Poker Crusher
                </h1>
                <div className="flex gap-4">
                  <a href="/" className="text-white/80 hover:text-white transition-colors">
                    Advisor
                  </a>
                  <a href="/learn" className="text-white/80 hover:text-white transition-colors">
                    Learn
                  </a>
                  <a href="/settings" className="text-white/80 hover:text-white transition-colors">
                    Settings
                  </a>
                </div>
              </nav>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
