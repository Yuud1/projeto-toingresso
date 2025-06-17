"use client"

import { Button } from "@/components/ui/button"
import { Download, Send, X, Maximize2, Minimize2 } from "lucide-react"
import { useState } from "react"

interface CertificateFullscreenPreviewProps {
  isOpen: boolean
  onClose: () => void
  htmlContent: string
  onDownload: () => void
  onSend: () => void
  isSending: boolean
  certificateTitle: string
}

export function CertificateFullscreenPreview({
  isOpen,
  onClose,
  htmlContent,
  onDownload,
  onSend,
  isSending,
  certificateTitle,
}: CertificateFullscreenPreviewProps) {
  const [isCompact, setIsCompact] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex flex-col">
      {/* Header com controles */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">{certificateTitle || "Preview do Certificado"}</h2>
          <div className="text-sm text-gray-500">Pressione ESC para fechar</div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsCompact(!isCompact)} className="hidden sm:flex">
            {isCompact ? <Maximize2 className="h-4 w-4 mr-2" /> : <Minimize2 className="h-4 w-4 mr-2" />}
            {isCompact ? "Expandir" : "Compactar"}
          </Button>

          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download HTML
          </Button>

          <Button size="sm" onClick={onSend} disabled={isSending}>
            <Send className="h-4 w-4 mr-2" />
            {isSending ? "Enviando..." : "Enviar para Backend"}
          </Button>

          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Área do preview */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <div
          className={`mx-auto bg-white shadow-2xl rounded-lg overflow-hidden ${isCompact ? "max-w-4xl" : "max-w-7xl"}`}
        >
          <iframe
            srcDoc={htmlContent}
            className="w-full border-0"
            style={{
              height: isCompact ? "600px" : "800px",
              minHeight: "600px",
            }}
            title="Preview do Certificado"
          />
        </div>
      </div>      
    </div>
  )
}
