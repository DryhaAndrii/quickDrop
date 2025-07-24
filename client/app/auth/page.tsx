'use client'

import CentralPanel from '@/app/components/centralPanel/centralPanel'
import Header from '@/app/components/header/header'
import toast from 'react-hot-toast'
import Loading, { useLoading } from '@/app/components/loading/loading'
import { fetchData } from '@/app/functionsAndHooks/fetch'
import AuthForm from './authForm'
import { useRouter } from 'next/navigation'
import { authFormType } from '@/types/authForm'

import { useAtom } from 'jotai'
import { roomNameAtom } from '@/store/roomName'
import { nicknameAtom } from '@/store/nickname'

export default function AuthPage() {
  const { hideLoading, showLoading, isShow } = useLoading()
  const [_, setRoomName] = useAtom(roomNameAtom)
  const [__, setNickname] = useAtom(nicknameAtom)
  const router = useRouter()

  const handleSubmit = async (data: authFormType, url: string) => {
    if(data.nickname==="System"){
      toast.error("System is a reserved nickname")
      return
    }
    const body = {
      room: {
        roomName: data.roomName,
        password: data.password,
      },
      nickname: data.nickname,
    }
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
    const response = await fetchData<any>(url, showLoading, hideLoading, options)

    if (response) {
      setRoomName(response.room.roomName)
      setNickname(response.nickname)
      toast.success(response.message)
      router.push('/')
    }
  }

  return (
    <div className="flex justify-center items-center m-auto w-[95%] max-w-96">
      <Loading isShow={isShow} />
      <div className="w-full">
        <CentralPanel>
          <div className="flex flex-col justify-between gap-3 px-5 py-10 size-full">
            <Header />

            <AuthForm handleSubmit={handleSubmit} />
          </div>
        </CentralPanel>
      </div>
    </div>
  )
}
