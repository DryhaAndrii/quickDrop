'use client'
import { Roboto } from 'next/font/google'
import ThemeSwitcher from '../themeSwitcher/themeSwitcher'


const roboto = Roboto({
  subsets: ['latin'],
  weight: '700',
})

export default function Header() {

  return (
    <header className="h-10 flex justify-between items-center">
      <h1
        className={`${roboto.className} grow text-5xl drop-shadow-textShadow text-foreground flex justify-center`}
      >
        QuickDrop
      </h1>
      <div className=" size-8">
        <ThemeSwitcher />
      </div>
    </header>
  )
}
