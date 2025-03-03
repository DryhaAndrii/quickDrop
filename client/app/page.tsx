'use client'
import CentralPanel from './components/centralPanel/centralPanel'
import Header from './components/header/header'
import Loading, { useLoading } from './components/loading/loading'

export default function Home() {
  const { hideLoading, showLoading, isShow } = useLoading()

  return (
    <div className="w-screen flex justify-center items-center h-screen">
      <Loading isShow={isShow} />
      <div className="w-[95%] h-[95%]">
        <CentralPanel>
          <div className="w-full h-full flex flex-col p-4 gap-5">
            <Header />
            Page
          </div>
        </CentralPanel>
      </div>
    </div>
  )
}
