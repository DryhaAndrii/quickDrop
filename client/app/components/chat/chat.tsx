import MessageInput from './messageInput'
import { useAtom } from 'jotai'
import { roomNameAtom } from '@/store/roomName'
import { nicknameAtom } from '@/store/nickname'
import { useEndpoints } from '@/endpointsAndPaths'
import { fetchData } from '@/app/functionsAndHooks/fetch'
import Loading, { useLoading } from '@/app/components/loading/loading'
import { MessageType } from '@/types/message'
import MessagesContainer from './messagesContainer'
import Users from './users'
import { UserType } from '@/types/user'

interface Props {
  messages: MessageType[]
  users: UserType[]
  getRoomInfo: () => void
}

export default function Chat({ messages, getRoomInfo, users }: Props) {
  const [roomName, _] = useAtom(roomNameAtom)
  const [nickname, __] = useAtom(nicknameAtom)
  const { addMessagesEndpoint } = useEndpoints({
    roomName,
  })
  const { hideLoading, showLoading, isShow } = useLoading()

  async function handleMessage(message: any) {
    const url = addMessagesEndpoint
    const body = {
      roomName,
      nickname,
      text: message,
    }
    const options = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
    const response = await fetchData<any>(url, showLoading, hideLoading, options)

    getRoomInfo()
  }

  return (
    <div className="shadow-insetShadow rounded-lg p-2 md:p-4 flex flex-col gap-4 relative">
      <Loading isShow={isShow} />
      <h3 className="text-lg font-bold text-foreground text-center">Chat</h3>
      <Users users={users} />

      {messages && messages.length > 0 && <MessagesContainer messages={messages} />}

      <MessageInput handleMessage={handleMessage} />
    </div>
  )
}
