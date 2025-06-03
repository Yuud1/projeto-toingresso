import { useState, useEffect, useCallback } from "react"

export const TOAST_REMOVE_DELAY = 1000
export const TOAST_LIFETIME = 5000

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  dismissed?: boolean
}

let count = 0

function generateId() {
  return `toast-${count++}`
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((toasts) => {
      if (toastId) {
        return toasts.map((toast) =>
          toast.id === toastId
            ? {
                ...toast,
                dismissed: true,
              }
            : toast,
        )
      }
      return toasts.map((toast) => ({
        ...toast,
        dismissed: true,
      }))
    })
  }, [])

  const remove = useCallback((toastId?: string) => {
    setToasts((toasts) => {
      if (toastId) {
        return toasts.filter((toast) => toast.id !== toastId)
      }
      return []
    })
  }, [])

  const toast = useCallback(
    ({ title, description, variant = "default" }: Omit<ToastProps, "id" | "dismissed">) => {
      const id = generateId()

      setToasts((toasts) => [...toasts, { id, title, description, variant }])

      // Auto dismiss after TOAST_LIFETIME
      setTimeout(() => {
        dismiss(id)
      }, TOAST_LIFETIME)

      return {
        id,
        dismiss: () => dismiss(id),
      }
    },
    [dismiss],
  )

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    toasts.forEach((toast) => {
      if (toast.dismissed) {
        const timeout = setTimeout(() => {
          remove(toast.id)
        }, TOAST_REMOVE_DELAY)

        timeouts.push(timeout)
      }
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [toasts, remove])

  return {
    toasts,
    toast,
    dismiss,
    remove,
  }
}
