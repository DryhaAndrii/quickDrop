import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/theme/theme'
import Toaster from './components/toaster/toaster'
import HooksCaller from './components/hooksCaller/hooksCaller'

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Quick Drop | Fast File Sharing',
  description:
    'Quick Drop allows you to share files instantly in temporary rooms. Upload, share, and download files before they disappear!',
  keywords: [
    'file sharing',
    'temporary file storage',
    'secure file transfer',
    'instant file sharing',
    'file exchange',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index, follow" />
        <meta
          name="google-site-verification"
          content="8AfkUjjnnQIS7GXQExZIyz1niGMIdJ1X3OJEOQ5J27M"
        />
      </head>
      <body
        className={`${montserrat.variable} antialiased bg-body-gradient h-dvh flex items-center justify-center`}
      >
        <Toaster />
        <ThemeProvider>
          <HooksCaller />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
