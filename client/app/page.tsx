import CentralPanel from './components/centralPanel/centralPanel'
import Header from './components/header/header'

export default function Home() {
  return (
    <div className="w-[95%] max-w-96 flex justify-center items-center m-auto h-screen">
      <div className="size-full h-[80%]">
        <CentralPanel>
          <Header />
          Page
        </CentralPanel>
      </div>
    </div>
  )
}
