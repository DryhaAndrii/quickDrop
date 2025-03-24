import { MessageType } from '@/types/message'
import Message from './message'
import { memo, useMemo, useRef, useEffect, useState } from 'react'

interface Props {
  messages: MessageType[]
}

export default memo(function MessagesContainer({ messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)

  const memoizedMessages = useMemo(
    () => messages?.map((message, index) => <Message key={index} message={message} />),
    [messages]
  )

  // Проверяем, находится ли пользователь внизу
  const isScrolledToBottom = () => {
    if (!containerRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    return scrollHeight - scrollTop <= clientHeight + 50 // Небольшой запас в 50px
  }

  // Скролл вниз при новых сообщениях, если пользователь уже внизу
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, autoScroll])

  // Обработчик скролла для определения, нужно ли автоскроллить
  const handleScroll = () => {
    if (containerRef.current) {
      setAutoScroll(isScrolledToBottom())
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-2 max-h-[400] overflow-auto custom-scroll"
      onScroll={handleScroll}
    >
      {memoizedMessages}
      <div ref={messagesEndRef} />
    </div>
  )
})