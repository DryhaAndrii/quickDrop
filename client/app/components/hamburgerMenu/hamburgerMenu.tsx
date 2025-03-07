'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Button from '../button/button'
import { ThemeSwitcher } from '../theme/theme'
import GoogleIcon from '../googleIcon/googleIcon'

export default function HamburgerMenu({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      {/* Button */}
      <div className="size-full">
        <Button onClick={toggleMenu}>
          <GoogleIcon iconName="menu" />
        </Button>
      </div>

      {/* Portal Menu */}
      {createPortal(
        <div
          className={`fixed top-0 right-0 w-[80%] md:w-96 h-full bg-central-panel-gradient text-foreground shadow-centralPanelShadow
             transition-transform duration-300 ease-in-out p-5 z-[100]
             ${isOpen ? 'transform translate-x-0' : 'transform translate-x-full'}`}
        >
          <div ref={menuRef} className="flex flex-col gap-5 [&>*]:h-10 relative">
            <Button onClick={toggleMenu}>
              <GoogleIcon iconName="close" />
            </Button>
            <ThemeSwitcher />
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
