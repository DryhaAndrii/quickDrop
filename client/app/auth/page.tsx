'use client'

import CentralPanel from '@/app/components/centralPanel/centralPanel'
import Header from '@/app/components/header/header'
import toast from 'react-hot-toast'
import Loading, { useLoading } from '@/app/components/loading/loading'
import { fetchData } from '@/app/functions/fetch'
import AuthForm from './authForm'

export default function AuthPage() {
  const { hideLoading, showLoading, isShow } = useLoading()

  const handleSubmit = async (formData: object, url: string) => {
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }
    try {
      const response: ServerResponse = await fetchData(url, showLoading, hideLoading, options)
      toast(`${response.message}`)
    } catch (error) {
      toast.error(`Error: ${error}`)
    }
  }

  return (
    <div className="w-[95%] max-w-96 flex justify-center items-center m-auto h-screen">
      <Loading isShow={isShow} />
      <div className="size-full h-[80%]">
        <CentralPanel>
          <div className="flex flex-col justify-between gap-1 p-5 size-full">
            <Header />

            <AuthForm handleSubmit={handleSubmit} />
          </div>
        </CentralPanel>
      </div>
    </div>
  )
}
