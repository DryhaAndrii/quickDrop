interface InputProps {
  variant?: 'default' | 'fullRounded',
  type?: 'text' | 'password'
  placeholder?: string,
  name?: string
}

export default function Input({ variant = 'default', type = 'text',placeholder,name }: InputProps) {
  const baseStyles =
    'w-full px-4 py-2 transition bg-transparent  text-foreground hover:opacity-80'
  const variants = {
    default: 'rounded-lg',
    fullRounded: 'rounded-full',
  }

  return <input name={name} placeholder={placeholder} type={type} className={`${baseStyles} ${variants[variant]} shadow-inputShadow`} />
}
