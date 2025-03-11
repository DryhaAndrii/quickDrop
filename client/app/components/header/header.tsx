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
    <header className="min-h-10 flex flex-col md:flex-row justify-between items-center relative md:pr-12 gap-2">
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
            QuickDrop
          </h2>
          <h1
            className={`${roboto.className}
                text-5xl drop-shadow-textShadow text-foreground flex justify-center break-all w-full grow
                md:absolute md:top-1/2 md:left-1/2 md:w-[60%] md:translate-x-[-50%] md:translate-y-[-50%]
                `}
          >
            {roomName}
          </h1>
          <h4
            className="text-2xl drop-shadow-textShadow
      text-foreground shrink-0 md:absolute right-20 md:top-1/2 md:translate-y-[-50%]"
          >
            ({apiUrl === API_URL_2 ? 'big files' : 'small files'})
          </h4>
        </>
      )}

      <div className="size-10 absolute right-0 top-0  ">
        <HamburgerMenu>{pathname === '/' && <LogoutButton />}</HamburgerMenu>
      </div>
    </header>
  )
}
