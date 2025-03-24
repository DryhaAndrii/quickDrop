'use client'
import { useAtom } from 'jotai'
import CentralPanel from './components/centralPanel/centralPanel'
import FileBoard from './components/fileBoard/fileBoard'
import Header from './components/header/header'
import Loading, { useLoading } from './components/loading/loading'
import { roomNameAtom } from '@/store/roomName'
import { useRoomMemoryLimits } from './functionsAndHooks/useRoomMemoryLimits'
import Chat from './components/chat/chat'

export default function Home() {
  const { hideLoading, showLoading, isShow } = useLoading()
  useRoomMemoryLimits()
  const [roomName, _] = useAtom(roomNameAtom)

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
            <FileBoard />
            <Chat />
          </div>
        </CentralPanel>
      </div>
    </div>
  )
}
