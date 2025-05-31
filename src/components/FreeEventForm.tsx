import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CustomFieldInterface from "@/interfaces/CustomFieldInterface";
import { applyMask } from "@/utils/formatUtils";
import axios from "axios";

interface Props {
  eventId: string;
  customFields: CustomFieldInterface[];
  setSubscribed: React.Dispatch<React.SetStateAction<boolean>>
  setQrCode: React.Dispatch<React.SetStateAction<null>>
}

const FreeEventForm = ({ customFields, eventId, setSubscribed, setQrCode }: Props) => {
  const [formData, setFormData] = useState<Record<string, any>>({});  

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(formData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_EVENT_SUBSCRIBE
        }${eventId}`,
        {
          subscriberData: formData,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.subscribed) {
        setSubscribed(true);
        setQrCode(response.data.ticket.qrCodeImage)
      }
    } catch (error) {
      console.log("Erro ao se cadastrar", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {customFields.map((field) => (
        <div key={field._id} className="flex flex-col gap-1">
          <Label className="text-base">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </Label>

          {(field.type === "text" || field.type === "email") && (
            <Input
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              onChange={(e) => {
                const rawValue = e.target.value;
                const maskedValue = applyMask(
                  rawValue,
                  field.maskType,
                  field.mask
                );
                handleChange(field.label, maskedValue);
              }}
              value={formData[field.label] || ""}
            />
          )}

          {field.type === "date" && (
            <Input
              type="date"
              required={field.required}
              onChange={(e) => handleChange(field.label, e.target.value)}
              value={formData[field.label] || ""}
            />
          )}

          {field.type === "checkbox" && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData[field.label] || false}
                onCheckedChange={(value) => handleChange(field.label, value)}
              />
              <span className="text-sm">{field.label}</span>
            </div>
          )}

          {field.type === "select" && field.options && (
            <Select
              onValueChange={(value) => handleChange(field.label, value)}
              value={formData[field.label] || ""}
            >
              <SelectTrigger>
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
      ))}
      <Button type="submit">Inscrever-se</Button>
    </form>
  );
};

export default FreeEventForm;
