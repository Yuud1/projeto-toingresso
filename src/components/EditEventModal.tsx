import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Image, Tag, Plus, Trash2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EventInterface from "@/interfaces/EventInterface";
import TicketInterface from "@/interfaces/TicketInterface";
import { Batch } from "@/interfaces/FormDataInterface";
import axios from "axios";
import FormBuilder from "./FormBuilder";

interface EditEventModalProps {
  event: EventInterface | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: EventInterface) => void;
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

const formatCEP = (cep: string) => {
  if (!cep) return "";
  cep = cep.replace(/\D/g, "");
  if (cep.length > 5) {
    return `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
  }
  return cep;
};

const formatNumber = (number: string) => {
  if (!number) return "";
  return number.replace(/\D/g, "");
};

// Função para formatar data para datetime-local
const formatDateTimeForInput = (dateString: string) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    // Formatar para YYYY-MM-DDTHH:mm (formato do datetime-local)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
};

// Função para formatar data para input type="date"
const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
};

// Função para formatar hora para input type="time"
const formatTimeForInput = (timeString: string) => {
  if (!timeString) return "";
  
  try {
    // Se for uma data completa, extrair apenas a hora
    if (timeString.includes('T') || timeString.includes(' ')) {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return "";
      
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    // Se já for uma string de hora (HH:mm)
    if (timeString.includes(':')) {
      return timeString;
    }
    
    return "";
  } catch (error) {
    console.error("Erro ao formatar hora:", error);
    return "";
  }
};

export function EditEventModal({
  event,
  isOpen,
  onClose,
  onSave,
}: EditEventModalProps) {
  const [editedEvent, setEditedEvent] = useState<EventInterface | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [municipiosPorUF, setMunicipiosPorUF] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (event) {
      setEditedEvent({
        ...event,
        dates: event.dates || [],
        batches: event.batches || [],
        acceptedTerms: event.acceptedTerms || false,
      });
      setCurrentStep(1);
      
      // Carregar municípios do estado atual se existir
      if (event.state) {
        buscarMunicipios(event.state);
      }
    }
  }, [event]);

  // Função para buscar municípios
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!editedEvent) return;

    setEditedEvent({
      ...editedEvent,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editedEvent) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedEvent({
          ...editedEvent,
          image: event.target?.result as string,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Funções para gerenciar períodos
  const addPeriod = () => {
    if (!editedEvent) return;
    const newPeriod = {
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      attractions: [],
      _id: `temp_${Date.now()}`,
    };
    setEditedEvent({
      ...editedEvent,
      dates: [...editedEvent.dates, newPeriod],
    });
  };

  const removePeriod = (index: number) => {
    if (!editedEvent) return;
    const newDates = editedEvent.dates.filter((_, i) => i !== index);
    setEditedEvent({
      ...editedEvent,
      dates: newDates,
    });
  };

  const updatePeriod = (index: number, field: string, value: string) => {
    if (!editedEvent) return;
    const newDates = [...editedEvent.dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setEditedEvent({
      ...editedEvent,
      dates: newDates,
    });
  };

  // Funções para gerenciar atrações
  const addAttraction = (periodIndex: number) => {
    if (!editedEvent) return;
    const newDates = [...editedEvent.dates];
    newDates[periodIndex].attractions.push({ name: "", social: "" });
    setEditedEvent({
      ...editedEvent,
      dates: newDates,
    });
  };

  const removeAttraction = (periodIndex: number, attractionIndex: number) => {
    if (!editedEvent) return;
    const newDates = [...editedEvent.dates];
    newDates[periodIndex].attractions.splice(attractionIndex, 1);
    setEditedEvent({
      ...editedEvent,
      dates: newDates,
    });
  };

  const updateAttraction = (periodIndex: number, attractionIndex: number, field: string, value: string) => {
    if (!editedEvent) return;
    const newDates = [...editedEvent.dates];
    newDates[periodIndex].attractions[attractionIndex] = {
      ...newDates[periodIndex].attractions[attractionIndex],
      [field]: value,
    };
    setEditedEvent({
      ...editedEvent,
      dates: newDates,
    });
  };

  // Funções para gerenciar lotes
  const addBatch = () => {
    if (!editedEvent) return;
    const newBatch: Batch = {
      batchName: "",
      saleStart: "",
      saleEnd: "",
      tickets: [],
    };
    setEditedEvent({
      ...editedEvent,
      batches: [...editedEvent.batches, newBatch],
    });
  };

  const removeBatch = (index: number) => {
    if (!editedEvent) return;
    const newBatches = editedEvent.batches.filter((_, i) => i !== index);
    setEditedEvent({
      ...editedEvent,
      batches: newBatches,
    });
  };

  const updateBatch = (index: number, field: string, value: string) => {
    if (!editedEvent) return;
    const newBatches = [...editedEvent.batches];
    newBatches[index] = { ...newBatches[index], [field]: value };
    setEditedEvent({
      ...editedEvent,
      batches: newBatches,
    });
  };

  // Funções para gerenciar ingressos nos lotes
  const addTicketToBatch = (batchIndex: number) => {
    if (!editedEvent) return;
    const newTicket: TicketInterface = {
      name: "",
      price: 0,
      quantity: 0,
      description: "",
      type: "regular",
      _id: `temp_${Date.now()}`,
      soldQuantity: 0,
    };
    const newBatches = [...editedEvent.batches];
    newBatches[batchIndex].tickets.push(newTicket);
    setEditedEvent({
      ...editedEvent,
      batches: newBatches,
    });
  };

  const removeTicketFromBatch = (batchIndex: number, ticketIndex: number) => {
    if (!editedEvent) return;
    const newBatches = [...editedEvent.batches];
    newBatches[batchIndex].tickets.splice(ticketIndex, 1);
    setEditedEvent({
      ...editedEvent,
      batches: newBatches,
    });
  };

  const updateTicketInBatch = (batchIndex: number, ticketIndex: number, field: string, value: any) => {
    if (!editedEvent) return;
    const newBatches = [...editedEvent.batches];
    newBatches[batchIndex].tickets[ticketIndex] = {
      ...newBatches[batchIndex].tickets[ticketIndex],
      [field]: value,
    };
    setEditedEvent({
      ...editedEvent,
      batches: newBatches,
    });
  };

  const handleSubmit = async () => {
    if (editedEvent) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_EVENT_UPDATEID
          }`,
          { editedEvent },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      
        if (response.data.edited) {          
          onSave(editedEvent);
          onClose();
        }
      } catch (error) {
        console.log("Erro ao editar evento", error)
      }
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  if (!editedEvent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Evento: {editedEvent.title}</DialogTitle>
          <DialogDescription>
            Atualize as informações do seu evento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200">
              <div
                className="h-full bg-[#02488C] transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
              />
            </div>

            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className="relative z-10 flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step === currentStep
                      ? "bg-[#02488C] text-white border-4 border-[#e2f0ff] ring-4 ring-[#02488C]/20"
                      : step < currentStep
                      ? "bg-[#02488C] text-white"
                      : "bg-white border-2 border-gray-300 text-gray-500"
                  }`}
                >
                  {step < currentStep ? (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                <span
                  className={`absolute -bottom-6 text-xs font-medium ${
                    step === currentStep
                      ? "text-[#02488C]"
                      : step < currentStep
                      ? "text-[#02488C]"
                      : "text-gray-500"
                  }`}
                >
                  {step === 1 && "Informações"}
                  {step === 2 && "Períodos"}
                  {step === 3 && "Descrição"}
                  {step === 4 && "Local"}
                  {step === 5 && "Ingressos"}
                  {step === 6 && "Termos"}
                </span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do evento *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={editedEvent.title}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem de divulgação
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-2 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <Image size={48} className="mx-auto" />
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Carregar arquivo</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF até 10MB (Recomendado: 1200x600px)
                    </p>
                    {editedEvent.image && (
                      <div className="mt-2">
                        <img
                          src={editedEvent.image}
                          alt="Preview"
                          className="max-h-40 mx-auto rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <div className="relative">
                  <Tag
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    name="category"
                    value={editedEvent.category || ""}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border rounded-md bg-white"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="shows">Shows</option>
                    <option value="teatro">Teatro</option>
                    <option value="esportes">Esportes</option>
                    <option value="festas">Festas</option>
                    <option value="cursos">Cursos</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Períodos do Evento</h3>
                <Button
                  type="button"
                  onClick={addPeriod}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Período
                </Button>
              </div>

              {editedEvent.dates.map((period, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Período {index + 1}</h4>
                    {editedEvent.dates.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePeriod(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Início *
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <Input
                          type="date"
                          value={formatDateForInput(period.startDate)}
                          onChange={(e) => updatePeriod(index, "startDate", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Início *
                      </label>
                      <div className="relative">
                        <Clock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <Input
                          type="time"
                          value={formatTimeForInput(period.startTime)}
                          onChange={(e) => updatePeriod(index, "startTime", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Término *
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <Input
                          type="date"
                          value={formatDateForInput(period.endDate)}
                          onChange={(e) => updatePeriod(index, "endDate", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Término *
                      </label>
                      <div className="relative">
                        <Clock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <Input
                          type="time"
                          value={formatTimeForInput(period.endTime)}
                          onChange={(e) => updatePeriod(index, "endTime", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Atrações do período */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Atrações (opcional)
                      </label>
                      <Button
                        type="button"
                        onClick={() => addAttraction(index)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Adicionar Atração
                      </Button>
                    </div>

                    {period.attractions.map((attraction, attrIndex) => (
                      <div key={attrIndex} className="flex gap-2 items-start">
                        <Input
                          type="text"
                          placeholder="Nome da atração"
                          value={attraction.name}
                          onChange={(e) => updateAttraction(index, attrIndex, "name", e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="text"
                          placeholder="Rede social/link (opcional)"
                          value={attraction.social || ""}
                          onChange={(e) => updateAttraction(index, attrIndex, "social", e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => removeAttraction(index, attrIndex)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <Textarea
                  name="description"
                  value={editedEvent.description}
                  onChange={handleChange}
                  className="w-full h-48"
                  placeholder="Descreva seu evento, incluindo detalhes sobre as atrações, programação, o que os participantes podem esperar..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Política do Evento
                </label>
                <Textarea
                  name="policy"
                  value={editedEvent.policy || ""}
                  onChange={handleChange}
                  className="w-full h-48"
                  placeholder="Políticas de cancelamento, reembolso, regras do evento..."
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 pt-8">
                Local do Evento
              </h2>

              {/* Nome do Local */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Local *
                </label>
                <Input
                  type="text"
                  name="venueName"
                  value={editedEvent.venueName}
                  onChange={handleChange}
                  placeholder="Ex: Teatro Municipal"
                  className="w-full"
                  required
                />
              </div>

              {/* CEP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CEP *
                  </label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formatCEP(editedEvent.zipCode || "")}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          name: "zipCode",
                          value: rawValue,
                        },
                      });
                    }}
                    placeholder="00000-000"
                    className="w-full"
                    maxLength={9}
                    required
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Av./Rua *
                  </label>
                  <Input
                    type="text"
                    name="street"
                    value={editedEvent.street || ""}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número *
                  </label>
                  <Input
                    type="text"
                    name="number"
                    value={formatNumber(editedEvent.number || "")}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      handleChange({
                        ...e,
                        target: {
                          ...e.target,
                          name: "number",
                          value: rawValue,
                        },
                      });
                    }}
                    className="w-full"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              {/* Complemento e Bairro */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complemento
                  </label>
                  <Input
                    type="text"
                    name="complement"
                    value={editedEvent.complement || ""}
                    onChange={handleChange}
                    placeholder="Apto, Sala, Conjunto..."
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro *
                  </label>
                  <Input
                    type="text"
                    name="neighborhood"
                    value={editedEvent.neighborhood || ""}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              {/* Cidade e Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o Estado *
                  </label>
                  <Select
                    onValueChange={async (sigla) => {
                      setEditedEvent((prev) => ({
                        ...prev!,
                        state: sigla,
                        city: "",
                      }));
                      await buscarMunicipios(sigla);
                    }}
                    value={editedEvent.state}
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione a Cidade
                  </label>
                  <Select
                    onValueChange={(municipio) =>
                      setEditedEvent((prev) => ({
                        ...prev!,
                        city: municipio,
                      }))
                    }
                    value={editedEvent.city}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          editedEvent.state
                            ? "Selecione o município"
                            : "Selecione um estado primeiro"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(municipiosPorUF[editedEvent.state] || []).map(
                        (municipio) => (
                          <SelectItem key={municipio} value={municipio}>
                            {municipio}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && !event?.isFree ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Lotes de Ingressos</h3>
                <Button
                  type="button"
                  onClick={addBatch}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Lote
                </Button>
              </div>

              {editedEvent.batches.map((batch, batchIndex) => (
                <div key={batchIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Lote {batchIndex + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeBatch(batchIndex)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Lote *
                      </label>
                      <Input
                        type="text"
                        value={batch.batchName}
                        onChange={(e) => updateBatch(batchIndex, "batchName", e.target.value)}
                        placeholder="Ex: Primeiro Lote, Promocional"
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Início da Venda *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formatDateTimeForInput(batch.saleStart)}
                        onChange={(e) => updateBatch(batchIndex, "saleStart", e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fim da Venda *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formatDateTimeForInput(batch.saleEnd)}
                        onChange={(e) => updateBatch(batchIndex, "saleEnd", e.target.value)}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Ingressos do lote */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Ingressos do Lote
                      </label>
                      <Button
                        type="button"
                        onClick={() => addTicketToBatch(batchIndex)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Adicionar Ingresso
                      </Button>
                    </div>

                    {batch.tickets.map((ticket, ticketIndex) => (
                      <div key={ticketIndex} className="border rounded p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">Ingresso {ticketIndex + 1}</h5>
                          <Button
                            type="button"
                            onClick={() => removeTicketFromBatch(batchIndex, ticketIndex)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nome do Ingresso *
                            </label>
                            <Input
                              type="text"
                              value={ticket.name}
                              onChange={(e) => updateTicketInBatch(batchIndex, ticketIndex, "name", e.target.value)}
                              placeholder="Ex: VIP, Camarote, Pista"
                              className="w-full"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Preço *
                            </label>
                            <Input
                              type="number"
                              value={ticket.price}
                              onChange={(e) => updateTicketInBatch(batchIndex, ticketIndex, "price", Number(e.target.value))}
                              placeholder="R$ 0,00"
                              className="w-full"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantidade Disponível *
                            </label>
                            <Input
                              type="number"
                              value={ticket.quantity}
                              onChange={(e) => updateTicketInBatch(batchIndex, ticketIndex, "quantity", Number(e.target.value))}
                              placeholder="0"
                              className="w-full"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo
                            </label>
                            <select
                              value={ticket.type}
                              onChange={(e) => updateTicketInBatch(batchIndex, ticketIndex, "type", e.target.value)}
                              className="w-full p-2 border rounded-md bg-white"
                            >
                              <option value="regular">Regular</option>
                              <option value="student">Meia-Entrada</option>
                              <option value="senior">Idoso</option>
                              <option value="free">Gratuito</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição
                          </label>
                          <Input
                            type="text"
                            value={ticket.description}
                            onChange={(e) => updateTicketInBatch(batchIndex, ticketIndex, "description", e.target.value)}
                            placeholder="Descrição do ingresso (opcional)"
                            className="w-full"
                          />
                        </div>

                        {/* Valor líquido (após taxa) */}
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm text-gray-600">
                            Valor líquido (após taxa de 10%):{" "}
                            <span className="font-medium text-green-600">
                              R$ {(ticket.price * 0.9).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : currentStep === 5 && event?.isFree ? (
            <FormBuilder form={event} setForm={setEditedEvent} />
          ) : null}

          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 pt-8">
                Responsabilidades
              </h2>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={editedEvent.acceptedTerms}
                    onCheckedChange={(checked: boolean) => {
                      setEditedEvent({
                        ...editedEvent,
                        acceptedTerms: checked,
                      });
                    }}
                    className="cursor-pointer"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Aceitar termos e condições
                    </label>
                    <p className="text-sm text-gray-500">
                      Ao publicar este evento, estou de acordo com os{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Termos de uso
                      </a>
                      , com as{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Diretrizes de Comunidade
                      </a>{" "}
                      e com as{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Regras de meia-entrada
                      </a>
                      , bem como declaro estar ciente da{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Política de Privacidade
                      </a>{" "}
                      e das{" "}
                      <a href="#" className="text-blue-600 hover:underline">
                        Obrigatoriedades Legais
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex justify-between w-full">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="cursor-pointer"
              >
                Voltar
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < 6 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="ml-auto cursor-pointer"
              >
                Próximo
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                className="ml-auto"
                disabled={!editedEvent.acceptedTerms}
              >
                Salvar Alterações
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
