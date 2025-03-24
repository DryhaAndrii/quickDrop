import { MessageType } from '@/types/message'
import Message from './message'
import { memo, useMemo, useRef, useEffect, useState } from 'react'

interface Props {
  messages: MessageType[]
}

export default memo(function MessagesContainer({ messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(false)

  const memoizedMessages = useMemo(
    () => messages?.map((message, index) => <Message key={index} message={message} />),
    [messages],
  )

  const isScrolledToBottom = () => {
    if (!containerRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    return scrollHeight - scrollTop <= clientHeight + 50
  }

  useEffect(() => {
    if (!containerRef.current || !autoScroll) return

    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [messages, autoScroll])

  const handleScroll = () => {
    if (containerRef.current) {
      setAutoScroll(isScrolledToBottom())
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        setAutoScroll(false)
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-2 max-h-96 overflow-auto custom-scroll"
      onScroll={handleScroll}
    >
      {memoizedMessages}
      <div ref={messagesEndRef} />
    </div>
  )
})
