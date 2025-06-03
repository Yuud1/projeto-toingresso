import * as React from "react"
import { X } from 'lucide-react'
import { cn } from "@/lib/utils"
import type { ToastProps } from "@/hooks/use-toast"

interface ToastComponentProps extends ToastProps {
  onDismiss?: (id: string) => void
}

const Toast = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & ToastComponentProps>(
  ({ className, title, description, variant = "default", id, onDismiss, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          variant === "default" && "bg-white border-gray-200 text-gray-900",
          variant === "destructive" && "bg-red-600 text-white border-red-600",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        <button
          onClick={() => onDismiss?.(id)}
          className={cn(
            "absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity",
            variant === "default" && "text-gray-500 hover:text-gray-900",
            variant === "destructive" && "text-white hover:text-white/80",
          )}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    )
  },
)
Toast.displayName = "Toast"

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const ToastViewport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:max-w-[420px]",
        className,
      )}
      {...props}
    />
  ),
)
ToastViewport.displayName = "ToastViewport"

export { Toast, ToastProvider, ToastViewport }
