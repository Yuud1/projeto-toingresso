import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

export function Avatar({ src, alt, fallback, className, ...props }: AvatarProps) {
  return (
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted", className)} {...props}>
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
      ) : fallback ? (
        fallback
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 font-bold">
          {alt ? alt[0] : "?"}
        </span>
      )}
    </div>
  )
} 