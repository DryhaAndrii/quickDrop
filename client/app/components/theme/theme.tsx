'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import Button from '@/app/components/button/button'
import GoogleIcon from '../googleIcon/googleIcon'

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
    <Button variant='rounded' onClick={themeButtonHandler}>
      <span className='flex justify-center items-center' style={{ textShadow: `0px 0px 4px var(--background)` }}>
        {currentTheme === 'dark' ? (
          <GoogleIcon iconName="light_mode" />
        ) : (
          <GoogleIcon iconName="dark_mode" />
        )}
      </span>
    </Button>
  )
}
