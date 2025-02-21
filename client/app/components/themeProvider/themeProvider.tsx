'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useState, useEffect } from 'react'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // unless the mounted state is true, do not render anything to avoid hydration errors
  if (!mounted) return <></>

  return (
    <NextThemesProvider attribute="class">
      {children}
    </NextThemesProvider>
  )
}
