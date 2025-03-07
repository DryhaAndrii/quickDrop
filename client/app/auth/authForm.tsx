'use client'
import Button from '@/app/components/button/button'
import Form from '@/app/components/form/form'
import Input from '@/app/components/input/input'
import { useEndpoints } from '@/endpointsAndPaths'
import { useState } from 'react'
import Switcher from './switcher'
import { authFormType } from '@/types/authForm'
import { useAtom } from 'jotai'
import { apiAtom } from '@/store/apiUrl'
import { API_URL, API_URL_2 } from '@/environments'
import GoogleIcon from '../components/googleIcon/googleIcon'

interface AuthFormProps {
  handleSubmit: (data: authFormType, url: string) => void
}

export default function AuthForm({ handleSubmit }: AuthFormProps) {
  const [selectedForm, setSelectedForm] = useState(0)
  const { createRoomEndpoint, joinRoomEndpoint } = useEndpoints()
  const [apiUrl, setApiUrl] = useAtom(apiAtom)

  function submitHandler(data: object) {
    let url = selectedForm === 0 ? joinRoomEndpoint : createRoomEndpoint
    const newData: authFormType = data as authFormType
    handleSubmit(newData, url)
  }
  function checkboxHandler() {
    setApiUrl((prev) => {
      const newApiUrl = prev === API_URL ? API_URL_2 : API_URL
      if (!newApiUrl) {
        throw new Error('newApiUrl is undefined')
      }
      localStorage.setItem('currentApiUrl', newApiUrl)
      return newApiUrl
    })
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
            name="roomName"
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
          <div
            className="flex items-center w-full justify-between px-4 py-2 text-foreground"
            onClick={checkboxHandler}
          >
            <p>Use big files api</p>
            <div className="flex border-2 rounded-xl size-8 border-foreground items-center justify-center">
              <div className="[&>*]:size-full flex items-center">
                {apiUrl === API_URL_2 ? <GoogleIcon iconName="check" /> : ''}
              </div>
            </div>
          </div>
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
