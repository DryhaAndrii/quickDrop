'use client'
import { Roboto } from 'next/font/google'
import { ThemeSwitcher } from '@/app/components/theme/theme'
import { usePathname } from 'next/navigation'
import { useAtom } from 'jotai'
import { roomNameAtom } from '@/store/roomName'
import HamburgerMenu from '../hamburgerMenu/hamburgerMenu'
import LogoutButton from '../logoutButton/logoutButton'
import { apiAtom } from '@/store/apiUrl'
import { API_URL_2 } from '@/environments'

const roboto = Roboto({
  subsets: ['latin'],
  weight: '700',
})

export default function Header() {
  const pathname = usePathname()
  const [roomName, setRoomName] = useAtom(roomNameAtom)
  const [apiUrl, setApiUrl] = useAtom(apiAtom)
  return (
    <header className="min-h-10 flex flex-col md:flex-row justify-between items-center relative">
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        rel="stylesheet"
      />
      {pathname === '/auth' && (
        <h2
          className={`${roboto.className} w-full text-center text-5xl drop-shadow-textShadow text-foreground`}
        >
          QuickDrop
        </h2>
      )}
      {pathname === '/' && (
        <>
          <h2
            className={`${roboto.className} md:absolute md:left-0 text-4xl drop-shadow-textShadow text-foreground`}
          >
            QuickDrop ({apiUrl === API_URL_2 ? 'big files' : 'small files'})
          </h2>
          <h1
            className={`${roboto.className}
      text-5xl drop-shadow-textShadow
      text-foreground flex justify-center
      break-all w-full

      `}
          >
            {roomName}
          </h1>
        </>
      )}

      <div className="size-10 absolute right-0  top-1/2 transform -translate-y-1/2">
        <HamburgerMenu>{pathname === '/' && <LogoutButton />}</HamburgerMenu>
      </div>
    </header>
  )
}
