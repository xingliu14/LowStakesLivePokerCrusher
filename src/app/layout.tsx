import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Low Stakes Live Poker Crusher',
  description: 'Make optimal poker decisions with AI-powered strategy recommendations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
