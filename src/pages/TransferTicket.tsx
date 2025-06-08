"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, ArrowRightLeft, Loader2, AlertCircle, User, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransferTicketProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticketId: string | undefined
}

export default function TransferTicket({ open, onOpenChange, ticketId }: TransferTicketProps) {
  const [cpf, setCpf] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    if (formatted.length <= 14) {
      setCpf(formatted)
      setError("")
    }
  }

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, "")
    return numbers.length === 11
  }

  const handleTransfer = async () => {
    if (!validateCPF(cpf)) {
      setError("Por favor, insira um CPF válido")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_TRANSFER_TICKET}`, {
        ticketId,
        cpf: cpf.replace(/\D/g, ""),
      },
      {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}}
    )

      if (response.data.success) {
        setSuccess(true)
        setTimeout(() => {
          onOpenChange(false)
          handleClose()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao transferir ticket. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setCpf("")
    setError("")
    setSuccess(false)
    setIsLoading(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose()
    }
    onOpenChange(open)
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[450px] rounded-2xl shadow-xl border-0">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 p-3 bg-green-100 rounded-full">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-green-700 mb-2">Transferência Realizada!</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              O ticket foi transferido com sucesso para o usuário informado.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-xl border-0 p-0 overflow-hidden">
        {/* Header com cores da marca */}
        <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 p-6 text-white relative overflow-hidden">
          {/* Padrão decorativo */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <Ticket className="w-full h-full rotate-12" />
          </div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/20 rounded-lg backdrop-blur-sm">
                <ArrowRightLeft className="h-6 w-6 text-blue-900" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-blue-900">Transferir Ticket</DialogTitle>
                <DialogDescription className="text-blue-800 mt-1 font-medium">Ticket ID: #{ticketId}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="p-2 bg-yellow-400 rounded-lg">
              <User className="h-5 w-5 text-blue-900" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">Transferência de Propriedade</p>
              <p className="text-sm text-blue-800">Digite o CPF do usuário que receberá o ticket</p>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="cpf" className="text-sm font-semibold text-blue-900">
              CPF do Destinatário
            </Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              className={cn(
                "h-12 text-lg border-2 focus-visible:ring-yellow-400 focus-visible:border-yellow-400",
                error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
              )}
              disabled={isLoading}
            />
            {error && (
              <Alert variant="destructive" className="py-2 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm text-red-700">{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-amber-400 rounded-full">
                <AlertCircle className="h-4 w-4 text-blue-900" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-blue-900">Atenção</p>
                <p className="text-blue-800 mt-1">
                  Esta ação não pode ser desfeita. O ticket será transferido permanentemente para o usuário informado.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="flex-1 border-2 border-blue-900 text-blue-900 hover:bg-blue-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={isLoading || !cpf}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-blue-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferindo...
              </>
            ) : (
              <>
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Transferir Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
