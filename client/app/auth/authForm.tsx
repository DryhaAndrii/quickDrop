'use client'
import Button from '@/app/components/button/button'
import Form from '@/app/components/form/form'
import Input from '@/app/components/input/input'
import { createRoomEndpoint, joinRoomEndpoint } from '@/endpointsAndPaths'
import { API_URL } from '@/environments'
import { useState } from 'react'
import Switcher from './switcher'
import { authFormType } from '@/types/authForm'

interface AuthFormProps {
  handleSubmit: (data: authFormType, url: string) => void
}

export default function AuthForm({ handleSubmit }: AuthFormProps) {
  const [selectedForm, setSelectedForm] = useState(0)

  function submitHandler(data: object) {
    let url = `${API_URL}/${createRoomEndpoint}`
    if (selectedForm === 0) {
      url = `${API_URL}/${joinRoomEndpoint}`
    }
    const newData: authFormType = data as authFormType
    handleSubmit(newData, url)
  }
  return (
    <>
      <div className="flex-grow justify-center flex flex-col">
        <Switcher setSelectedForm={setSelectedForm} />
      </div>

      <Form onSubmit={submitHandler}>
        <h2 className="text-center font-bold text-foreground text-2xl drop-shadow-textShadow">
          {selectedForm === 0 ? 'Join room' : 'Create room'}
        </h2>
        <div className="w-[95%] flex flex-col gap-3 m-0 mx-auto">
          <Input
            placeholder={selectedForm === 0 ? 'Room id' : 'Come up with a room id'}
            variant="fullRounded"
            name="roomId"
            maxLength={10}
          />

          <Input
            placeholder={
              selectedForm === 0 ? 'Room password' : 'Come up with a password for the room'
            }
            variant="fullRounded"
            name="password"
            maxLength={10}
          />
          <Input
            placeholder={selectedForm === 0 ? 'Your nickname' : 'Come up with your nickname'}
            variant="fullRounded"
            name="nickname"
            maxLength={20}
          />
        </div>
        <div className="w-[50%] h-10 justify-center m-0 mx-auto">
          <Button variant="fullRounded" type="submit">
            {selectedForm === 0 ? 'Join' : 'Create'}
          </Button>
        </div>
      </Form>
    </>
  )
}
