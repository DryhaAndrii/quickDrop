import { MessageType } from '@/types/message'
import Message from './message'

interface Props {
  messages: MessageType[]
}

export default function MessagesContainer({ messages }: Props) {
  return (
    <div className="flex flex-col gap-2 max-h-[400] overflow-auto custom-scroll">
      {messages?.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  )
}
