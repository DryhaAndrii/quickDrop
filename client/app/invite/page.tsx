'use client'

import CentralPanel from '@/app/components/centralPanel/centralPanel'
import Header from '@/app/components/header/header'
import Loading, { useLoading } from '@/app/components/loading/loading'
import Form from '../components/form/form'
import Button from '../components/button/button'
import Input from '../components/input/input'
import { BIG_API_URL, SMALL_API_URL } from '@/environments'
import GoogleIcon from '../components/googleIcon/googleIcon'
import { useAtom } from 'jotai'
import { apiAtom } from '@/store/apiUrl'
import { fetchData } from '../functionsAndHooks/fetch'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import { useEndpoints } from '@/endpointsAndPaths'
import { roomNameAtom } from '@/store/roomName'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const { hideLoading, showLoading, isShow } = useLoading()
  const { exchangeInviteIdEndpoint } = useEndpoints()
  const [apiUrl, setApiUrl] = useAtom(apiAtom)
  const searchParams = useSearchParams()
  const inviteId = searchParams.get('inviteId')
  const [_, setRoomName] = useAtom(roomNameAtom)
  const router = useRouter()

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

  async function submitHandler(data: { nickname: string }) {
    const url = `${exchangeInviteIdEndpoint}/${inviteId}/${data.nickname}`
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }

    const response = await fetchData<any>(url, showLoading, hideLoading, options)

    console.log('response:', response)
    if (response) {
      setRoomName(response.room.roomName)
      toast.success(response.message)
      router.push('/')
    }
  }

  return (
    <div className="w-[95%] max-w-96 flex justify-center items-center m-auto h-full">
      <Loading isShow={isShow} />
      <div className="w-full">
        <CentralPanel>
          <div className="flex flex-col justify-between gap-3 px-5 py-10 size-full">
            <Header />
            <Form onSubmit={submitHandler}>
              <div className="w-[95%] flex flex-col gap-3 m-0 mx-auto">
                <h3 className="text-lg font-medium text-foreground text-center drop-shadow-smallTextShadow">
                  You've been invited into the room, make up a nickname to proceed
                </h3>
                <Input
                  placeholder="Nickname"
                  variant="fullRounded"
                  name="nickname"
                  maxLength={20}
                />
              </div>
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
              <div className="w-[50%] h-10 justify-center m-0 mx-auto">
                <Button variant="fullRounded" type="submit">
                  Proceed
                </Button>
              </div>
            </Form>
          </div>
        </CentralPanel>
      </div>
    </div>
  )
}
