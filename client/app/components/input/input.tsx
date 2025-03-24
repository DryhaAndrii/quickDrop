'use client'
import { collapseMultipleSpaces, removeLeadingSpaces } from '@/constants/regs'

interface InputProps {
  variant?: 'default' | 'fullRounded'
  type?: 'text' | 'password'
  placeholder?: string
  name?: string
  maxLength?: number
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Input({
  variant = 'default',
  type = 'text',
  placeholder,
  name,
  maxLength,
  value,
  onChange,
}: InputProps) {
  const baseStyles =
    'w-full px-4 py-2 transition bg-transparent font-bold text-foreground hover:opacity-80'
  const variants = {
    default: 'rounded-none',
    fullRounded: 'rounded-full',
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    event.target.value = value.replace(removeLeadingSpaces, '').replace(collapseMultipleSpaces, ' ')
    if (onChange) {
      onChange(event)
    }
  }

  return (
    <input
      name={name}
      placeholder={placeholder}
      type={type}
      className={`${baseStyles} ${variants[variant]} shadow-inputShadow`}
      onInput={handleInput}
      maxLength={maxLength}
      value={value}
    />
  )
}
