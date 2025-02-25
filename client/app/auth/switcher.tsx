import { useState } from 'react'
import SwitchItem from './switchItem'

interface SwitcherProps {
  setSelectedForm: (index: number) => void
}

export default function Switcher({ setSelectedForm }: SwitcherProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const handleClick = (index: number) => {
    setSelectedIndex(index)
    setSelectedForm(index)
  }

  return (
    <div className="w-full flex justify-between items-center h-16 ">
      <SwitchItem text="Join room" selected={selectedIndex === 0} onClick={() => handleClick(0)} />
      <SwitchItem
        text="Create room"
        selected={selectedIndex === 1}
        onClick={() => handleClick(1)}
      />
    </div>
  )
}
