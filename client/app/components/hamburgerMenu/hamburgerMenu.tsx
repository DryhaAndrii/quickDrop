'use client'
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Button from '../button/button'
import { ThemeSwitcher } from '../theme/theme'
import GoogleIcon from '../googleIcon/googleIcon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '../logoutButton/logoutButton'
import CreateInviteButton from '../createInviteButton/createInviteButton'

interface Props {
  children?: React.ReactNode
  iconName?: string
}

export default function HamburgerMenu({ children, iconName='menu' }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

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
        <Button variant="rounded" onClick={toggleMenu}>
          <GoogleIcon iconName={iconName} />
        </Button>
      </div>

      {/* Portal Menu */}
      {createPortal(
        <div
          className={`fixed top-0 right-0 w-[80%] md:w-96 h-full bg-central-panel-gradient text-foreground shadow-centralPanelShadow
             transition-transform duration-300 ease-in-out p-5 z-[50]
             ${isOpen ? 'transform translate-x-0' : 'transform translate-x-full'}`}
        >
          <div ref={menuRef} className="flex flex-col gap-5 [&>button]:h-10 relative">
            {/* Button that close menu */}
            <Button variant="rounded" onClick={toggleMenu}>
              <GoogleIcon iconName="close" />
            </Button>

            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
