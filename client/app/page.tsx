'use client'
import { useAtom } from 'jotai'
import CentralPanel from './components/centralPanel/centralPanel'
import FileBoard from './components/fileBoard/fileBoard'
import Header from './components/header/header'
import Loading, { useLoading } from './components/loading/loading'
import { roomNameAtom } from '@/store/roomName'
import { useRoomMemoryLimits } from './functionsAndHooks/useRoomMemoryLimits'
import Chat from './components/chat/chat'
import { nicknameAtom } from '@/store/nickname'
import { useEndpoints } from '@/endpointsAndPaths'
import { fetchData } from './functionsAndHooks/fetch'
import { UserType } from '@/types/user'
import { useEffect, useState } from 'react'
import { MessageType } from '@/types/message'
import { FileType } from '@/types/file'

export default function Home() {
  const { hideLoading, showLoading, isShow } = useLoading()
  useRoomMemoryLimits()
  const [roomName, _] = useAtom(roomNameAtom)
  const [nickname, __] = useAtom(nicknameAtom)
  const { getRoomInfoEndpoint } = useEndpoints({ roomName })
  const [users, setUsers] = useState<UserType[]>([])
  const [messages, setMessages] = useState<MessageType[]>([])
  const [files, setFiles] = useState<FileType[]>([])

  useEffect(() => {
    if (!roomName) return

    const fetchRoomInfo = async () => {
      await getRoomInfo()
    }

    fetchRoomInfo()

    const intervalId = setInterval(fetchRoomInfo, 5000)

    return () => clearInterval(intervalId)
  }, [roomName])

  async function getRoomInfo() {
    const options = {
      method: 'GET',
      credentials: 'include',
    }

    const url = `${getRoomInfoEndpoint}/${nickname}`
    const response = await fetchData<any>(url, undefined, undefined, options)


    setUsers((prevUsers) => {
      if (JSON.stringify(prevUsers) !== JSON.stringify(response.users)) {
        return response.users
      }
      return prevUsers
    })

    setMessages((prevMessages) => {
      if (JSON.stringify(prevMessages) !== JSON.stringify(response.messages)) {
        return response.messages
      }
      return prevMessages
    })

    setFiles((prevFiles) => {
      if (JSON.stringify(prevFiles) !== JSON.stringify(response.files)) {
        return response.files
      }
      return prevFiles
    })
  }

  if (roomName === '') {
    return (
      <div className="w-screen flex justify-center items-center h-screen">
        <Loading isShow={true} />
        <div className="w-[95%] h-[95%]">
          <CentralPanel>
            <></>
          </CentralPanel>
        </div>
      </div>
    )
  }
  return (
    <div className="w-screen flex justify-center items-center h-full py-4">
      <Loading isShow={isShow} />
      <div className="w-[95%] h-[95%]">
        <CentralPanel>
          <div className="w-full h-full flex flex-col p-2 md:p-4 gap-5">
            <Header />
            <FileBoard roomFiles={files} getRoomInfo={getRoomInfo} />
            <Chat messages={messages} users={users} getRoomInfo={getRoomInfo} />
          </div>
        </CentralPanel>
      </div>
    </div>
  )
}
