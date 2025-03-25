import { useEffect, useState } from 'react'
import MessageInput from './messageInput'
import { useAtom } from 'jotai'
import { roomNameAtom } from '@/store/roomName'
import { nicknameAtom } from '@/store/nickname'
import { useEndpoints } from '@/endpointsAndPaths'
import { fetchData } from '@/app/functionsAndHooks/fetch'
import Loading, { useLoading } from '@/app/components/loading/loading'
import { MessageType } from '@/types/message'
import MessagesContainer from './messagesContainer'
import HamburgerMenu from '../hamburgerMenu/hamburgerMenu'

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [roomName, _] = useAtom(roomNameAtom)
  const [nickname, __] = useAtom(nicknameAtom)
  const { addMessagesEndpoint, getMessagesEndpoint } = useEndpoints({
    roomName,
  })
  const { hideLoading, showLoading, isShow } = useLoading()

  useEffect(() => {
    const fetchMessages = async () => {
      await getMessages()
    }

    fetchMessages()

    const intervalId = setInterval(fetchMessages, 5000)

    return () => clearInterval(intervalId)
  }, [])

  async function getMessages() {
    const options = {
      method: 'GET',
      credentials: 'include',
    }
    const response = await fetchData<any>(getMessagesEndpoint, undefined, undefined, options)

    if (JSON.stringify(response.messages) !== JSON.stringify(messages)) {
      setMessages(response.messages)
    }
  }

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

    getMessages()
  }

  return (
    <div className="shadow-insetShadow rounded-lg p-2 md:p-4 flex flex-col gap-4">
      <Loading isShow={isShow} />
      <h3 className="text-lg font-bold text-foreground text-center">Chat</h3>

      {messages && messages.length > 0 && <MessagesContainer messages={messages} />}

      <MessageInput handleMessage={handleMessage} />
    </div>
  )
}
