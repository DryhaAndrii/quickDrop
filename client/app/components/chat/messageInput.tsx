import { useState } from 'react'
import Button from '../button/button'
import Form from '../form/form'
import Input from '../input/input'
import GoogleIcon from '../googleIcon/googleIcon'

interface Props {
  handleMessage: (message: any) => void
}

export default function MessageInput({ handleMessage }: Props) {
  const [message, setMessage] = useState('')
  function submitHandler(data: any) {
    handleMessage(data.message)
    setMessage('')
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }
  return (
    <Form onSubmit={submitHandler} minCharacter={1}>
      <div className="flex">
        <div className="flex flex-col gap-3 m-0 mx-auto grow">
          <Input
            placeholder={'Enter you message...'}
            name="message"
            maxLength={300}
            value={message}
            onChange={handleInputChange}
          />
        </div>
        <div className="h-10 w-14 justify-center m-0 mx-auto shrink-0">
          <Button type="submit"><GoogleIcon iconName='Send'/></Button>
        </div>
      </div>
    </Form>
  )
}
