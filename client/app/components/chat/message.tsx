import { nicknameAtom } from '@/store/nickname'
import { MessageType } from '@/types/message'
import { useAtom } from 'jotai'
import { memo, useEffect } from 'react'

interface Props {
  message: MessageType
}

export default memo(function Message({ message }: Props) {
  const [nickname, __] = useAtom(nicknameAtom)
  const formattedDate = new Date(message.createdAt).toLocaleString()

  useEffect(() => {
    console.log('Message was rerendered')
  }, [])

  const userMessage = message.authorNickname === nickname
  const alignMessageStyle = userMessage ? 'justify-end' : 'justify-start'

  return (
    <div className={`size-full flex ${alignMessageStyle}`}>
      <div className="border-foreground border-[1px] w-auto max-w-96 p-2 rounded-lg text-foreground">
        <TextContainer style={alignMessageStyle}>
          <p className="text-[10px] break-words">{message.authorNickname}</p>
        </TextContainer>
        <TextContainer style={alignMessageStyle}>
          <p className="break-words">{message.text}</p>
        </TextContainer>
        <TextContainer style={alignMessageStyle}>
          <p className="text-[10px] break-words">{formattedDate}</p>
        </TextContainer>
      </div>
    </div>
  )
})

function TextContainer({ children, style }: { children: React.ReactNode; style: string }) {
  return <div className={`flex ${style}`}>{children}</div>
}
