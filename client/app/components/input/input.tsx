'use client'
import { collapseMultipleSpaces, removeLeadingSpaces } from "@/constants/regs";

interface InputProps {
  variant?: 'default' | 'fullRounded',
  type?: 'text' | 'password'
  placeholder?: string,
  name?: string,
  maxLength?: number
}

export default function Input({ variant = 'default', type = 'text', placeholder, name, maxLength }: InputProps) {
  const baseStyles =
    'w-full px-4 py-2 transition bg-transparent font-bold text-foreground hover:opacity-80'
  const variants = {
    default: 'rounded-lg',
    fullRounded: 'rounded-full',
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    event.target.value = value.replace(removeLeadingSpaces, '').replace(collapseMultipleSpaces, ' ');
  };

  return (
    <input
      name={name}
      placeholder={placeholder}
      type={type}
      className={`${baseStyles} ${variants[variant]} shadow-inputShadow`}
      onInput={handleInput}
      maxLength={maxLength}
    />
  );
}
