'use client'
import Button from '@/app/components/button/button'
import Form from '@/app/components/form/form'
import Input from '@/app/components/input/input'
import { createRoomEndpoint, joinRoomEndpoint } from '@/endpoints'
import { API_URL } from '@/environments'
import { useState } from 'react'
import Switcher from './switcher'

interface AuthFormProps {
  handleSubmit: (data: object, url: string) => void
}

export default function AuthForm({ handleSubmit }: AuthFormProps) {
  const [selectedForm, setSelectedForm] = useState(0)

  function submitHandler(data: object) {
    let url = `${API_URL}/${createRoomEndpoint}`
    if (selectedForm === 0) {
      url = `${API_URL}/${joinRoomEndpoint}`
    }

    handleSubmit(data, url)
  }
  return (
    <>
      <div className="flex-grow justify-center flex flex-col">
        <Switcher setSelectedForm={setSelectedForm} />
      </div>

      {selectedForm === 0 ? (
        <Form onSubmit={submitHandler}>
          <h2 className='text-center font-bold text-foreground text-3xl drop-shadow-textShadow'>Join room</h2>
          <div className="w-[95%] flex flex-col gap-8 m-0 mx-auto">
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
              Join
            </Button>
          </div>
        </Form>
      ) : (
        <Form onSubmit={submitHandler}>
          <h2 className='text-center font-bold text-foreground text-2xl drop-shadow-textShadow'>Create room</h2>
          <div className="w-[95%] flex flex-col gap-8 m-0 mx-auto">
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
              Create
            </Button>
          </div>
        </Form>
      )}
    </>
  )
}
