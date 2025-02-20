'use client'
import Button from '../button/button'
import { useTheme } from 'next-themes'
export default function ThemeSwitcher() {
  const { theme, setTheme, systemTheme } = useTheme()

  function themeButtonHandler() {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
    console.log('Theme')
  }

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <Button onClick={themeButtonHandler}>
      <span style={{ textShadow: `0px 0px 4px var(--background)` }}>{currentTheme === 'dark' ? '🌞' : '🌙'}</span>
    </Button>
  )
}
