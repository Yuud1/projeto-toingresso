import { Loader2 } from "lucide-react"

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <img src={"../../public/logos/TOingresso_logo_512x512.png"} alt="Logo" className="object-contain" />
        </div>

        {/* Loading spinner */}
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    </div>
  )
}
