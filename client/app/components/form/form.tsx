'use client'

interface FormProps {
  children?: React.ReactNode
  onSubmit: (data: object) => void
}

export default function Form({ children, onSubmit }: FormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries());

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="grow flex flex-col gap-10 justify-evenly">
      {children}
    </form>
  )
}
