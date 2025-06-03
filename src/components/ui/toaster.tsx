import { useEffect, useState } from "react"
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const activeToasts = toasts.filter((toast) => !toast.dismissed)

  return (
    <ToastProvider>
      <ToastViewport>
        {activeToasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            onDismiss={dismiss}
          />
        ))}
      </ToastViewport>
    </ToastProvider>
  )
}
