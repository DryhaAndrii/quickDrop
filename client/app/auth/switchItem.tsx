export default function SwitchItem({
  text,
  selected,
  onClick,
}: {
  text: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <div
      className={`w-1/2 h-full text-center font-bold text-foreground
                flex justify-center items-center cursor-pointer
                border-foreground
                ${selected && 'shadow-insetShadow'}
                first:rounded-tl-[20px] first:rounded-bl-[20px]
                last:rounded-tr-[20px] last:rounded-br-[20px]
                `}
      onClick={onClick}
    >
      {text}
    </div>
  )
}
