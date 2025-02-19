import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: '700',
})

export default function Header() {
  return (
    <header className="h-10 ">
      <h1 className={`${roboto.className} text-5xl drop-shadow-textShadow text-foreground flex justify-center`}>QuickDrop</h1>
    </header>
  )
}
