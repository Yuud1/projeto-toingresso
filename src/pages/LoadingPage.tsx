import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function LoadingPage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <div className="absolute inset-0 bg-[#FEC800] rounded-2xl opacity-10 animate-pulse" />
          <div className="relative w-full h-full bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
            <img
              src="/public/icon.png"
              alt="TOingresso Logo"
              className="w-16 h-16 md:w-24 md:h-24 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-gray-200 rounded-full animate-spin">
              <div className="absolute inset-0 border-3 border-transparent border-t-[#FEC800] rounded-full animate-spin" />
            </div>
            <Loader2 className="absolute inset-0 m-auto h-5 w-5 text-gray-400 animate-spin" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-black">Carregando</h2>
            <p className="text-sm text-gray-500">Aguarde um momento...</p>
          </div>

          <div className="w-64 space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-[#FEC800] rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="text-center">
              <span className="text-xs text-gray-400">{Math.round(Math.min(progress, 100))}%</span>
            </div>
          </div>

          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#FEC800] rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-[#FEC800] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 bg-[#FEC800] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
