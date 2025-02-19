interface CentralPanelProps {
  children: React.ReactNode
}

export default function CentralPanel({ children }: CentralPanelProps) {
  return (
    <div className="w-[90%] sm:w-3/4 md:w-[50%] flex justify-center items-center m-auto h-screen">
      <div className="flex flex-col justify-between gap-5 p-5 w-full  bg-background2 h-[80%] bg-form-gradient-light dark:bg-form-gradient-dark rounded-xl shadow-centralPanelShadow">
        {children}
      </div>
    </div>
  )
}
