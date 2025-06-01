import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type CustomFieldInterface from "@/interfaces/CustomFieldInterface"
import { applyMask } from "@/utils/formatUtils"
import axios from "axios"

interface Props {
  eventId: string
  customFields: CustomFieldInterface[]
  setSubscribed: React.Dispatch<React.SetStateAction<boolean>>
  setQrCode: React.Dispatch<React.SetStateAction<null>>
}

const FreeEventForm = ({ customFields, eventId, setSubscribed, setQrCode }: Props) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      console.log(formData)

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_EVENT_SUBSCRIBE}${eventId}`,
        {
          subscriberData: formData,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )

      if (response.data.subscribed) {
        setSubscribed(true)
        setQrCode(response.data.ticket.qrCodeImage)
      }
    } catch (error) {
      console.log("Erro ao se cadastrar", error)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = customFields.filter((field) => field.required).every((field) => formData[field.label])

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="p-4 border rounded-lg space-y-4">
          {customFields.map((field) => (
            <div key={field._id} className="space-y-3 border-b pb-4 last:border-b-0 last:pb-0">
              <div className="space-y-1">
                <Label className="font-semibold text-base">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.placeholder && <p className="text-sm text-gray-600">{field.placeholder}</p>}
              </div>

              <div className="space-y-2">
                {(field.type === "text" || field.type === "email") && (
                  <Input
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    onChange={(e) => {
                      const rawValue = e.target.value
                      const maskedValue = applyMask(rawValue, field.maskType, field.mask)
                      handleChange(field.label, maskedValue)
                    }}
                    value={formData[field.label] || ""}
                    className="w-full"
                  />
                )}

                {field.type === "date" && (
                  <Input
                    type="date"
                    required={field.required}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    value={formData[field.label] || ""}
                    className="w-full"
                  />
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center gap-3 p-2">
                    <Checkbox
                      checked={formData[field.label] || false}
                      onCheckedChange={(value) => handleChange(field.label, value)}
                      className="cursor-pointer"
                    />
                    <span className="text-sm font-medium">{field.label}</span>
                  </div>
                )}

                {field.type === "select" && field.options && (
                  <Select
                    onValueChange={(value) => handleChange(field.label, value)}
                    value={formData[field.label] || ""}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Selecione ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-[#FEC800] text-black hover:bg-[#e5b700] font-semibold cursor-pointer"
            disabled={!isFormValid || loading}
          >
            {loading ? "Processando..." : "Inscrever-se Gratuitamente"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default FreeEventForm
