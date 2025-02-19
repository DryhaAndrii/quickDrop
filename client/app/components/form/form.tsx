'use client'
interface FormProps {
  children?: React.ReactNode
}

export default function Form({ children }: FormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    console.log('Form data:', data)
  }
  return (
    <form onSubmit={handleSubmit} className="grow flex flex-col gap-5 justify-center ">
      {children}
    </form>
  )
}
