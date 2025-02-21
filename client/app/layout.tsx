import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import ThemeUpdater from './components/themeUpdater/themeUpdater'
import ThemeProvider from './components/themeProvider/themeProvider'

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
      <body className={`${montserrat.variable} antialiased bg-body-gradient`}>
        <ThemeProvider>
          <ThemeUpdater />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
