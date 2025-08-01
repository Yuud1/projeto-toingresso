import React, { useState } from "react";
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
import type CustomFieldInterface from "@/interfaces/CustomFieldInterface";
import { applyMask } from "@/utils/formatUtils";
import axios from "axios";
import { Textarea } from "./ui/textarea";

interface Props {
  eventId: string;
  customFields: CustomFieldInterface[];
  setSubscribed: React.Dispatch<React.SetStateAction<boolean>>;
  setQrCode: React.Dispatch<React.SetStateAction<null>>;
  onAlreadySubscribed?: () => void;
}

const estadosMunicipios = {
  AC: { nome: "Acre" },
  AL: { nome: "Alagoas" },
  AP: { nome: "Amapá" },
  AM: { nome: "Amazonas" },
  BA: { nome: "Bahia" },
  CE: { nome: "Ceará" },
  DF: { nome: "Distrito Federal" },
  ES: { nome: "Espírito Santo" },
  GO: { nome: "Goiás" },
  MA: { nome: "Maranhão" },
  MT: { nome: "Mato Grosso" },
  MS: { nome: "Mato Grosso do Sul" },
  MG: { nome: "Minas Gerais" },
  PA: { nome: "Pará" },
  PB: { nome: "Paraíba" },
  PR: { nome: "Paraná" },
  PE: { nome: "Pernambuco" },
  PI: { nome: "Piauí" },
  RJ: { nome: "Rio de Janeiro" },
  RN: { nome: "Rio Grande do Norte" },
  RS: { nome: "Rio Grande do Sul" },
  RO: { nome: "Rondônia" },
  RR: { nome: "Roraima" },
  SC: { nome: "Santa Catarina" },
  SP: { nome: "São Paulo" },
  SE: { nome: "Sergipe" },
  TO: { nome: "Tocantins" },
};

const FreeEventForm = ({
  customFields,
  eventId,
  setSubscribed,
  setQrCode,
  onAlreadySubscribed,
}: Props) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [municipiosPorUF, setMunicipiosPorUF] = useState<
    Record<string, string[]>
  >({});

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const buscarMunicipios = async (sigla: string) => {
    if (municipiosPorUF[sigla]) return;

    try {
      const res = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`
      );
      const data = await res.json();
      const nomes = data.map((m: any) => m.nome);
      setMunicipiosPorUF((prev) => ({ ...prev, [sigla]: nomes }));
    } catch (err) {
      console.error("Erro ao buscar municípios:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!localStorage.getItem("token")) {
        window.location.href = "/login";
      }
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_EVENT_SUBSCRIBE
        }${eventId}`,
        { subscriberData: formData },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.subscribed) {
        setSubscribed(true);
        setQrCode(response.data.ticket.qrCodeImage);
      }
    } catch (error: any) {
      console.log("Erro ao se cadastrar", error);

      // Verificar se o erro é porque o usuário já está inscrito
      if (
        error.response?.status === 409 ||
        error.response?.data?.message?.includes("já está inscrito") ||
        error.response?.data?.message?.includes("already subscribed")
      ) {
        onAlreadySubscribed?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = customFields
    .filter((field) => field.required)
    .every((field) => {
      if (field.type === "estado-municipio") {
        return (
          formData[`${field.label}_estado`] &&
          formData[`${field.label}_municipio`]
        );
      }
      return formData[field.label];
    });

  return (
    <div className="space-y-6 w-full">
      <form onSubmit={handleSubmit}>
        <div className="p-4 border rounded-lg space-y-4">
          {customFields.map((field) => (
            <div
              key={field._id}
              className="space-y-3 border-b pb-4 last:border-b-0 last:pb-0 min-w-32"
            >
              <div className="space-y-1">
                <Label className="font-semibold text-base">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                {field.placeholder && (
                  <p className="text-sm text-gray-600">{field.placeholder}</p>
                )}
              </div>

              <div className="space-y-2">
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
                    className="w-full"
                  />
                )}

                {field.type === "number" && (
                  <Input
                    type="text"
                    inputMode="numeric"
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
                    className="w-full"
                  />
                )}

                {field.type === "date" && (
                  <Input
                    type="date"
                    required={field.required}
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
                    className="w-full"
                  />
                )}

                {field.type === "textarea" && (
                  <Textarea
                    required={field.required}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    value={formData[field.label] || ""}
                    className="w-full"
                  />
                )}

                {field.type === "radio" && (
                  <div className="space-y-2">
                    <p className="font-medium">{field.label}</p>
                    {field.options?.map((option: string) => (
                      <label
                        key={option}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="radio"
                          name={field.label}
                          value={option}
                          required={field.required}
                          checked={formData[field.label] === option}
                          onChange={(e) =>
                            handleChange(field.label, e.target.value)
                          }
                          className="accent-blue-500"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {field.type === "checkbox" && (
                  <div className="flex items-center gap-3 p-2">
                    <Checkbox
                      checked={formData[field.label] || false}
                      onCheckedChange={(value) =>
                        handleChange(field.label, value)
                      }
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
                      <SelectValue placeholder={`Selecione`} />
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

                {field.type === "estado-municipio" && (
                  <>
                    {/* Estado */}
                    <Select
                      onValueChange={async (sigla) => {
                        handleChange(`${field.label}_estado`, sigla);
                        handleChange(`${field.label}_municipio`, "");
                        await buscarMunicipios(sigla);
                      }}
                      value={formData[`${field.label}_estado`] || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(estadosMunicipios).map(
                          ([sigla, { nome }]) => (
                            <SelectItem key={sigla} value={sigla}>
                              {nome}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>

                    {/* Município */}
                    <Select
                      onValueChange={(municipio) =>
                        handleChange(`${field.label}_municipio`, municipio)
                      }
                      value={formData[`${field.label}_municipio`] || ""}
                      disabled={!formData[`${field.label}_estado`]}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            !formData[`${field.label}_estado`]
                              ? "Selecione um estado primeiro"
                              : "Selecione o município"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          municipiosPorUF[formData[`${field.label}_estado`]] ||
                          []
                        ).map((municipio) => (
                          <SelectItem key={municipio} value={municipio}>
                            {municipio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
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
  );
};

export default FreeEventForm;
