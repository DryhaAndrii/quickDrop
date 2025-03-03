'use client'
import { useEffect } from 'react'
import CentralPanel from './components/centralPanel/centralPanel'
import Header from './components/header/header'
import Loading, { useLoading } from './components/loading/loading'
import { useRoomAuth } from './functionsAndHooks/useRoomAuth'

export default function Home() {
  const { hideLoading, showLoading, isShow } = useLoading()

  return (
    <div className="w-[95%] max-w-96 flex justify-center items-center m-auto h-screen">
      <Loading isShow={isShow} />
      <div className="size-full h-[80%]">
        <CentralPanel>
          <Header />
          Page
        </CentralPanel>
      </div>
    </div>
  )
}
