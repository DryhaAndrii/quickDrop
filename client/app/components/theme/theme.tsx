'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import Button from '@/app/components/button/button'

export function ThemeUpdater() {
  const { theme, systemTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    if (typeof window !== 'undefined' && currentTheme) {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(currentTheme)
    }
  }, [currentTheme])

  return null
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

  return (
    <NextThemesProvider attribute="class">
      <ThemeUpdater />
      {children}
    </NextThemesProvider>
  )
}

export function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme()

  function themeButtonHandler() {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <Button onClick={themeButtonHandler}>
      <span style={{ textShadow: `0px 0px 4px var(--background)` }}>
        {currentTheme === 'dark' ? '🌞' : '🌙'}
      </span>
    </Button>
  )
}
