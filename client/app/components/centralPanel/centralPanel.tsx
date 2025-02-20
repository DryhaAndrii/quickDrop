interface CentralPanelProps {
  children: React.ReactNode
}

export default function CentralPanel({ children }: CentralPanelProps) {
  return (
    <div className="size-full flex flex-col justify-between gap-5 p-5 w-full bg-central-panel-gradient rounded-xl shadow-centralPanelShadow">
      {children}
    </div>
  )
}
