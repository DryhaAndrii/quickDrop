interface CentralPanelProps {
  children: React.ReactNode
}

export default function CentralPanel({ children }: CentralPanelProps) {
  return (
    <div className="bg-central-panel-gradient shadow-centralPanelShadow rounded-xl w-full">
      {children}
    </div>
  )
}
