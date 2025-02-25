interface CentralPanelProps {
  children: React.ReactNode
}

export default function CentralPanel({ children }: CentralPanelProps) {
  return (
    <div className="size-full bg-central-panel-gradient rounded-xl shadow-centralPanelShadow">
      {children}
    </div>
  )
}
