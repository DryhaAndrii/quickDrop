import Button from './components/button/button'
import CentralPanel from './components/centralPanel/centralPanel'
import Form from './components/form/form'
import Header from './components/header/header'
import Input from './components/input/input'

export default function Home() {
  return (
    <div className="w-[95%] max-w-96 flex justify-center items-center m-auto h-screen">
      <div className='size-full h-[80%]'>
        <CentralPanel>
          <Header />
          <Form>
            <div className="w-[95%] flex flex-col gap-5 m-0 mx-auto">
              <Input placeholder="Room id" variant="fullRounded" name="roomId" maxLength={10}/>
              <Input placeholder="Your nickname" variant="fullRounded" name="nickName" maxLength={20}/>
            </div>
            <div className="w-[50%] h-10 justify-center m-0 mx-auto">
              <Button variant="fullRounded" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </CentralPanel>
      </div>
    </div>
  )
}
