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
import { SMALL_API_URL, BIG_API_URL } from '@/environments'
import GoogleIcon from '../components/googleIcon/googleIcon'
import { fetchData } from '../functionsAndHooks/fetch'
import Loading, { useLoading } from '../components/loading/loading'
import toast from 'react-hot-toast'

interface AuthFormProps {
  handleSubmit: (data: authFormType, url: string) => void
}

export default function AuthForm({ handleSubmit }: AuthFormProps) {
  const [selectedForm, setSelectedForm] = useState(0)
  const { createRoomEndpoint, joinRoomEndpoint } = useEndpoints()
  const [apiUrl, setApiUrl] = useAtom(apiAtom)
  const { hideLoading, showLoading, isShow } = useLoading()

  function submitHandler(data: object) {
    let url = selectedForm === 0 ? joinRoomEndpoint : createRoomEndpoint
    const newData: authFormType = data as authFormType
    handleSubmit(newData, url)
  }
  async function checkboxHandler() {
    //Checking if big api is available
    if (apiUrl === SMALL_API_URL) {
      if (BIG_API_URL) {
        const options = {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }
        const response = await fetchData(BIG_API_URL, showLoading, hideLoading, options, false)
        if (!response) {
          toast.error('Big api is not available now, using small api')
          return
        }
      }
    }

    setApiUrl((prev) => {
      const newApiUrl = prev === SMALL_API_URL ? BIG_API_URL : SMALL_API_URL
      if (!newApiUrl) {
        throw new Error('newApiUrl is undefined')
      }
      localStorage.setItem('currentApiUrl', newApiUrl)

      return newApiUrl
    })
  }
  return (
    <>
      <Loading isShow={isShow} />
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
            className="flex items-center w-full justify-between px-4 py-2 text-foreground font-semibold cursor-pointer"
            onClick={checkboxHandler}
          >
            <p>Use big files api</p>
            <div className="flex border-2 rounded-xl size-8 border-foreground items-center justify-center">
              <div className="[&>*]:size-full flex items-center">
                {apiUrl === BIG_API_URL ? <GoogleIcon iconName="check" /> : ''}
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
