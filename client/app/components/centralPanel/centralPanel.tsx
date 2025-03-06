interface CentralPanelProps {
  children: React.ReactNode
}

export default function CentralPanel({ children }: CentralPanelProps) {
  return (
    <div className="w-full min-h-full bg-central-panel-gradient rounded-xl shadow-centralPanelShadow">
      {children}
    </div>
  )
}
