'use client'

import { useState } from 'react'
import Button from './components/button/button'
import CentralPanel from './components/centralPanel/centralPanel'
import Form from './components/form/form'
import Header from './components/header/header'
import Input from './components/input/input'
import toast from 'react-hot-toast'
import { API_URL } from '@/environments'
import { roomsEndpoint } from '@/endpoints'



export default function Home() {
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (formData: object) => {
    setLoading(true)

    try {
      const url = `${API_URL}/${roomsEndpoint}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log('Server response:', result)
    } catch (error) {
      toast.error(`Error submitting form: ${error}`,)
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-[95%] max-w-96 flex justify-center items-center m-auto h-screen">
      <div className="size-full h-[80%]">
        <CentralPanel>
          <Header />
          <Form onSubmit={handleSubmit}>
            <div className="w-[95%] flex flex-col gap-5 m-0 mx-auto">
              <Input placeholder="Room id" variant="fullRounded" name="roomId" maxLength={10} />
              <Input
                placeholder="Your nickname"
                variant="fullRounded"
                name="nickName"
                maxLength={20}
              />
            </div>
            <div className="w-[50%] h-10 justify-center m-0 mx-auto">
              <Button variant="fullRounded" type="submit">
                Create or join
              </Button>
            </div>
          </Form>
        </CentralPanel>
      </div>
    </div>
  )
}
