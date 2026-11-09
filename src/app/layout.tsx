import type { Metadata, Viewport } from 'next'
import { DM_Sans, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const sans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ATMOS - Weather',
  description: 'A quiet monochrome weather briefing with live conditions and precipitation.',
  keywords: ['weather', 'forecast', 'radar', 'precipitation'],
  authors: [{ name: 'ATMOS' }],
  manifest: '/manifest.json',
  applicationName: 'ATMOS',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#e8e7e3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3200,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              border: '1px solid var(--toast-border)',
              borderRadius: '14px',
              fontSize: '13px',
              letterSpacing: '0.01em',
            },
          }}
        />
      </body>
    </html>
  )
}
