interface ButtonProps {
  children?: React.ReactNode
  variant?: 'default' | 'fullRounded'
  type?: 'button' | 'submit',
  onClick?: () => void
}

export default function Button({ onClick, children, variant = 'default', type = 'button' }: ButtonProps) {
  const baseStyles = 'size-full flex justify-center items-center  shadow-md transition bg-foreground text-background hover:opacity-80 dark:bg-white'
  const variants = {
    default: 'rounded-lg',
    fullRounded: 'rounded-full',
  }

  return (
    <button onClick={onClick} type={type} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  )
}
