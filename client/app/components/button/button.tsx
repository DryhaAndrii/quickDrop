interface ButtonProps {
  children?: React.ReactNode
  variant?: 'default' | 'fullRounded' | 'rounded'
  type?: 'button' | 'submit'
  onClick?: () => void
}

export default function Button({
  onClick,
  children,
  variant = 'default',
  type = 'button',
}: ButtonProps) {
  const baseStyles = `
    size-full flex justify-center items-center transition
    bg-foreground text-background
    hover:translate-y-[-2px] hover:shadow-hoverShadow
    active:translate-y-[2px] active:shadow-activeShadow
  `
  const variants = {
    default: 'rounded-none',
    rounded: 'rounded-lg',
    fullRounded: 'rounded-full',
  }

  return (
    <button onClick={onClick} type={type} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  )
}
