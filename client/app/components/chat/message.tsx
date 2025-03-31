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

  const userMessage = message.authorNickname === nickname
  const systemMessage = message.authorNickname === 'System'
  const alignMessageStyle = userMessage ? 'justify-end' : 'justify-start'

  if (systemMessage) {
    return (
      <div className={`flex justify-center`}>
        <div
          className={`flex-col w-auto max-w-96 p-2 rounded-lg text-background bg-foreground`}
        >
          <div>
            <p className="break-words">{message.text}</p>
          </div>
          <div>
            <p className="text-[10px] break-words text-center">{formattedDate}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`size-full flex ${alignMessageStyle}`}>
      <div
        className={`w-auto max-w-64 p-2 rounded-lg text-background bg-foreground`}
      >
        <TextContainer style={alignMessageStyle}>
          <p className="text-[10px] break-words max-w-full">{message.authorNickname}</p>
        </TextContainer>
        <TextContainer style={alignMessageStyle}>
          <p className="break-words max-w-full">{message.text}</p>
        </TextContainer>
        <TextContainer style={alignMessageStyle}>
          <p className="text-[10px] break-words max-w-full">{formattedDate}</p>
        </TextContainer>
      </div>
    </div>
  )
})

function TextContainer({ children, style }: { children: React.ReactNode; style: string }) {
  return <div className={`flex ${style}`}>{children}</div>
}
