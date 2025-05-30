"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Lock, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddCardFormProps {
  onClose?: () => void
  onSave?: (cardData: CardData) => void
  isOpen?: boolean
}

interface CardData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  isDefault: boolean
}

export default function AddCardForm({ onClose, onSave, isOpen = true }: AddCardFormProps) {
  const [formData, setFormData] = useState<CardData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    isDefault: false,
  })

  const [errors, setErrors] = useState<Partial<CardData>>({})
  const [loading, setLoading] = useState(false)

  // Função para formatar número do cartão
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  // Função para formatar data de expiração
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  // Detectar tipo do cartão
  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "")
    if (cleanNumber.startsWith("4")) return "VISA"
    if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2")) return "MASTERCARD"
    if (cleanNumber.startsWith("34") || cleanNumber.startsWith("37")) return "AMEX"
    if (cleanNumber.startsWith("636368") || cleanNumber.startsWith("438935") || cleanNumber.startsWith("504175"))
      return "ELO"
    return "OUTRO"
  }

  const handleInputChange = (field: keyof CardData, value: string | boolean) => {
    let formattedValue = value

    if (field === "cardNumber" && typeof value === "string") {
      formattedValue = formatCardNumber(value)
    } else if (field === "expiryDate" && typeof value === "string") {
      formattedValue = formatExpiryDate(value)
    } else if (field === "cvv" && typeof value === "string") {
      formattedValue = value.replace(/[^0-9]/g, "").substring(0, 4)
    }

    setFormData((prev) => ({
      ...prev,
      [field]: formattedValue,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CardData> = {}

    const cleanCardNumber = formData.cardNumber.replace(/\s/g, "")
    if (!cleanCardNumber) {
      newErrors.cardNumber = "Número do cartão é obrigatório"
    } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      newErrors.cardNumber = "Número do cartão inválido"
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Data de expiração é obrigatória"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Formato inválido (MM/AA)"
    } else {
      const [month, year] = formData.expiryDate.split("/")
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1

      if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
        newErrors.expiryDate = "Mês inválido"
      } else if (
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Cartão expirado"
      }
    }

    if (!formData.cvv) {
      newErrors.cvv = "CVV é obrigatório"
    } else if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      newErrors.cvv = "CVV inválido"
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Nome do portador é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onSave?.(formData)
      onClose?.()
    } catch (error) {
      console.error("Erro ao salvar cartão:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const cardType = getCardType(formData.cardNumber)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Adicionar Cartão</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Preview do Cartão com novo visual */}
            <div className="rounded-lg p-4 text-white relative overflow-hidden shadow-lg h-48">
              {/* Fundo do cartão baseado na bandeira */}
              {cardType === "VISA" && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                </div>
              )}
              {cardType === "MASTERCARD" && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                </div>
              )}
              {cardType === "AMEX" && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-teal-600">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                </div>
              )}
              {cardType === "ELO" && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                </div>
              )}
              {cardType === "OUTRO" && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#02488C] to-[#0369a1]">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
                </div>
              )}

              {/* Conteúdo do cartão */}
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  {/* Chip do cartão */}
                  <div className="w-10 h-8 bg-yellow-400 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-inner flex items-center justify-center">
                    <div className="w-8 h-6 border-2 border-yellow-600/30 rounded-sm"></div>
                  </div>

                  {/* Logo da bandeira */}
                  <div className="text-right">
                    {cardType === "VISA" && (
                      <div className="text-white font-bold italic text-xl tracking-tighter">VISA</div>
                    )}
                    {cardType === "MASTERCARD" && (
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-red-600 rounded-full opacity-80"></div>
                        <div className="w-6 h-6 bg-yellow-400 rounded-full -ml-3 opacity-80"></div>
                      </div>
                    )}
                    {cardType === "AMEX" && <div className="text-white font-bold text-lg">AMEX</div>}
                    {cardType === "ELO" && <div className="text-white font-bold text-lg">ELO</div>}
                    {cardType === "OUTRO" && <CreditCard className="h-6 w-6" />}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-lg font-mono tracking-wider">{formData.cardNumber || "•••• •••• •••• ••••"}</div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="text-xs opacity-75">PORTADOR</div>
                      <div className="uppercase font-medium">{formData.cardholderName || "NOME DO PORTADOR"}</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-75">VÁLIDO ATÉ</div>
                      <div className="font-medium">{formData.expiryDate || "MM/AA"}</div>
                    </div>
                  </div>
                </div>

                {/* Elementos decorativos */}
                <div className="absolute bottom-2 right-2 opacity-30">
                  <svg width="40" height="26" viewBox="0 0 40 26" className="text-white">
                    <path
                      d="M10.5 25.5C4.7 25.5 0 20.8 0 15C0 9.2 4.7 4.5 10.5 4.5C16.3 4.5 21 9.2 21 15C21 20.8 16.3 25.5 10.5 25.5ZM29.5 25.5C23.7 25.5 19 20.8 19 15C19 9.2 23.7 4.5 29.5 4.5C35.3 4.5 40 9.2 40 15C40 20.8 35.3 25.5 29.5 25.5Z"
                      fill="currentColor"
                      fillOpacity="0.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número do cartão</label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  maxLength={19}
                  className={cn(errors.cardNumber && "border-red-500")}
                />
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do portador</label>
                <Input
                  type="text"
                  placeholder="Nome como está no cartão"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                  className={cn(errors.cardholderName && "border-red-500")}
                />
                {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de expiração</label>
                  <Input
                    type="text"
                    placeholder="MM/AA"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                    maxLength={5}
                    className={cn(errors.expiryDate && "border-red-500")}
                  />
                  {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      maxLength={4}
                      className={cn("pr-8", errors.cvv && "border-red-500")}
                    />
                    <Lock className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                  className="rounded border-gray-300 text-[#02488C] focus:ring-[#02488C]"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Definir como cartão padrão
                </label>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-[#02488C] text-white hover:bg-[#023a6f]" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Cartão"}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
              <Lock className="h-3 w-3" />
              <span>Suas informações são protegidas com criptografia SSL</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
