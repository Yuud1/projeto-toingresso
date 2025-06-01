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
import { Calendar, Clock, Image, Tag, Ticket } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import EventInterface from "@/interfaces/EventInterface";
import TicketInterface from "@/interfaces/TicketInterface";
import axios from "axios";
import FormBuilder from "./FormBuilder";

interface EditEventModalProps {
  event: EventInterface | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEvent: EventInterface) => void;
}

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

export function EditEventModal({
  event,
  isOpen,
  onClose,
  onSave,
}: EditEventModalProps) {
  const [editedEvent, setEditedEvent] = useState<EventInterface | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (event) {
      setEditedEvent({
        ...event,
        tickets: event.tickets || [],
        acceptedTerms: event.acceptedTerms || false,
      });
      setCurrentStep(1);
    }
  }, [event]);

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
                  {step === 2 && "Data/Hora"}
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
                      name="startDate"
                      value={
                        editedEvent.startDate
                          ? format(
                              new Date(editedEvent.startDate),
                              "yyyy-MM-dd"
                            )
                          : ""
                      }
                      onChange={handleChange}
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
                      name="startTime"
                      value={editedEvent.startTime || "19:00"}
                      onChange={handleChange}
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
                      name="endDate"
                      value={
                        editedEvent.endDate
                          ? format(new Date(editedEvent.endDate), "yyyy-MM-dd")
                          : ""
                      }
                      onChange={handleChange}
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
                      name="endTime"
                      value={editedEvent.endTime || "22:00"}
                      onChange={handleChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
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
                    Cidade *
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={editedEvent.city || ""}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    name="state"
                    value={editedEvent.state || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md bg-white"
                    required
                  >
                    <option value="">Selecione o estado</option>
                    <option value="AC">Palmas</option>
                    <option value="AL">Gurupi</option>
                    <option value="AL">Araguaína</option>
                    <option value="AL">Porto Nacional</option>
                    <option value="AL">Paraíso do Tocantins</option>
                    <option value="AL">Guaraí</option>
                    <option value="AL">Dianópolis</option>
                    <option value="AL">Miracema do Tocantins</option>
                    <option value="AL">Formoso do Araguaia</option>
                    <option value="AL">Pedro Afonso</option>
                    <option value="AL">Tocantinópolis</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && !event?.isFree ? (                     
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 pt-8">
                Ingressos
              </h2>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Que tipo de ingresso você deseja criar?
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipos de Ingresso */}
                  <div
                    onClick={() => {
                      const newTicket: TicketInterface = {
                        name: "",
                        price: 0,
                        quantity: 0,
                        description: "",
                        type: "regular",
                        _id: "",
                        soldQuantity: 0,
                      };
                      setEditedEvent({
                        ...editedEvent,
                        tickets: [...editedEvent.tickets, newTicket],
                      });
                    }}
                    className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <div className="text-center">
                      <Ticket className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <h4 className="font-medium text-gray-900">
                        Ingresso Regular
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Ingresso com preço padrão
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      const newTicket: TicketInterface = {
                        name: "",
                        price: 0,
                        quantity: 0,
                        description: "",
                        type: "student",
                        _id: "",
                        soldQuantity: 0,
                      };
                      setEditedEvent({
                        ...editedEvent,
                        tickets: [...editedEvent.tickets, newTicket],
                      });
                    }}
                    className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <div className="text-center">
                      <Ticket className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <h4 className="font-medium text-gray-900">
                        Meia-Entrada
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Ingresso com 50% de desconto
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de Ingressos */}
                {editedEvent.tickets.length > 0 && (
                  <div className="mt-8">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Ingressos Criados
                    </h4>
                    <div className="space-y-4">
                      {editedEvent.tickets.map((ticket, index) => (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg shadow-sm"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nome do Ingresso */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nome do Ingresso *
                              </label>
                              <Input
                                type="text"
                                value={ticket.name}
                                onChange={(e) => {
                                  const updatedTickets = [
                                    ...editedEvent.tickets,
                                  ];
                                  updatedTickets[index].name = e.target.value;
                                  setEditedEvent({
                                    ...editedEvent,
                                    tickets: updatedTickets,
                                  });
                                }}
                                placeholder="Ex: VIP, Camarote, Pista"
                                className="w-full"
                                required
                              />
                            </div>

                            {/* Preço */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Preço *
                              </label>
                              <Input
                                type="number"
                                value={ticket.price}
                                onChange={(e) => {
                                  const updatedTickets = [
                                    ...editedEvent.tickets,
                                  ];
                                  updatedTickets[index].price = Number(
                                    e.target.value
                                  );
                                  setEditedEvent({
                                    ...editedEvent,
                                    tickets: updatedTickets,
                                  });
                                }}
                                placeholder="R$ 0,00"
                                className="w-full"
                                required
                              />
                            </div>

                            {/* Quantidade */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantidade Disponível *
                              </label>
                              <Input
                                type="number"
                                value={ticket.quantity}
                                onChange={(e) => {
                                  const updatedTickets = [
                                    ...editedEvent.tickets,
                                  ];
                                  updatedTickets[index].quantity = Number(
                                    e.target.value
                                  );
                                  setEditedEvent({
                                    ...editedEvent,
                                    tickets: updatedTickets,
                                  });
                                }}
                                placeholder="0"
                                className="w-full"
                                required
                              />
                            </div>

                            {/* Descrição */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descrição
                              </label>
                              <Input
                                type="text"
                                value={ticket.description}
                                onChange={(e) => {
                                  const updatedTickets = [
                                    ...editedEvent.tickets,
                                  ];
                                  updatedTickets[index].description =
                                    e.target.value;
                                  setEditedEvent({
                                    ...editedEvent,
                                    tickets: updatedTickets,
                                  });
                                }}
                                placeholder="Descrição do ingresso (opcional)"
                                className="w-full"
                              />
                            </div>
                          </div>

                          {/* Botão Remover */}
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4 text-red-600 hover:text-red-700"
                            onClick={() => {
                              const updatedTickets = editedEvent.tickets.filter(
                                (_, i) => i !== index
                              );
                              setEditedEvent({
                                ...editedEvent,
                                tickets: updatedTickets,
                              });
                            }}
                          >
                            Remover Ingresso
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ): currentStep === 5 && event?.isFree && event ?
          (
            <FormBuilder form={event} setForm={setEditedEvent}></FormBuilder> 
          ) :
          null
          }

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
