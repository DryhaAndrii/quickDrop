import Button from './components/button/button'
import Form from './components/form/form'
import Input from './components/input/input'

export default function Home() {
  return (
    <Form>
      <div className="w-[95%] md:w-[80%] flex flex-col gap-5 m-0 mx-auto">
        <Input placeholder="Room id" variant="fullRounded" name='roomId'/>
        <Input placeholder="Your nickname" variant="fullRounded" name='nickName'/>
      </div>
      <div className="w-[50%] justify-center m-0 mx-auto">
        <Button variant="fullRounded" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  )
}
