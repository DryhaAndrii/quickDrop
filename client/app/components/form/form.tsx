'use client'

import toast from "react-hot-toast"

interface FormProps {
  children?: React.ReactNode
  onSubmit: (data: any) => void
}

export default function Form({ children, onSubmit }: FormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && (value.length < 3)) {
        toast.error("Fields should contain more then 3 characters")
        return
      }
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="grow flex flex-col justify-evenly gap-3">
      {children}
    </form>
  )
}
