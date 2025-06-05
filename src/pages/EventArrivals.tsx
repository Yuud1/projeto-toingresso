import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DroppableProvided,
  type DraggableProvided,  
} from "react-beautiful-dnd";
import {
  User,
  Settings,
  Eye,
  Trash2,
  Plus,
  GripVertical,
  Save,
  Check,
  X,
  RefreshCw,
  UserCheck,
  Instagram,
  Globe,
  Phone,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Info,
  AlertCircle,
  List,
  Grid,
} from "lucide-react";
import type CustomFieldInterface from "../interfaces/CustomFieldInterface";
import type { FieldType } from "../interfaces/CustomFieldInterface";

interface UserTicketsInterface {
  _id: string;
  eventId: string;
  ticketType: string;
  purchaseDate: string;
  isUsed: boolean;
}

interface UserInterface {
  _id: string;
  name: string;
  cpf: string;
  email: string;
  emailVerified: string;
  birthdaydata: string;
  type: "user" | "superUser" | "admin";
  mysite: string;
  instagram: string;
  facebook: string;
  phoneNumber: string;
  avatar: string;
  tickets: UserTicketsInterface[];
  customFields?: Record<string, string>;
}

interface EventArrival extends UserInterface {
  arrivalTime: string;
  isNew: boolean;
}

// Mock data para o evento
const eventData = {
  title: "Workshop de React Avançado 2024",
  date: "15 de Janeiro, 2024",
  time: "09:00 - 18:00",
  location: "Centro de Convenções - São Paulo",
};

// Mock data para chegadas
const mockArrivals: EventArrival[] = [
  {
    _id: "1",
    name: "Ana Silva",
    cpf: "123.456.789-00",
    email: "ana@email.com",
    emailVerified: "true",
    birthdaydata: "1990-05-15",
    type: "user",
    mysite: "anasilva.dev",
    instagram: "@ana_silva_dev",
    facebook: "",
    phoneNumber: "(11) 98765-4321",
    avatar: "/placeholder.svg?height=100&width=100",
    tickets: [],
    arrivalTime: new Date().toISOString(),
    isNew: false,
    customFields: {
      cargo: "Desenvolvedora Frontend",
      empresa: "TechCorp",
      interesse: "React, TypeScript",
    },
  },
  {
    _id: "2",
    name: "Carlos Mendes",
    cpf: "987.654.321-00",
    email: "carlos@email.com",
    emailVerified: "true",
    birthdaydata: "1985-08-22",
    type: "user",
    mysite: "carlosmendes.com.br",
    instagram: "@carlos_tech",
    facebook: "",
    phoneNumber: "(11) 91234-5678",
    avatar: "/placeholder.svg?height=100&width=100",
    tickets: [],
    arrivalTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutos atrás
    isNew: false,
    customFields: {
      cargo: "Tech Lead",
      empresa: "StartupXYZ",
      interesse: "Node.js, AWS",
    },
  },
  {
    _id: "3",
    name: "Maria Santos",
    cpf: "456.789.123-00",
    email: "maria@email.com",
    emailVerified: "true",
    birthdaydata: "1992-12-03",
    type: "user",
    mysite: "",
    instagram: "@maria_designer",
    facebook: "",
    phoneNumber: "(21) 99876-5432",
    avatar: "/placeholder.svg?height=100&width=100",
    tickets: [],
    arrivalTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutos atrás
    isNew: false,
    customFields: {
      cargo: "UX Designer",
      empresa: "DesignStudio",
      interesse: "UI/UX, Figma",
    },
  },
];

// Campos padrão disponíveis
const defaultFields = [
  { id: "name", label: "Nome", icon: <User size={16} /> },
  { id: "instagram", label: "Instagram", icon: <Instagram size={16} /> },
  { id: "email", label: "Email", icon: <Mail size={16} /> },
  { id: "phoneNumber", label: "Telefone", icon: <Phone size={16} /> },
  { id: "mysite", label: "Website", icon: <Globe size={16} /> },
  {
    id: "birthdaydata",
    label: "Data de Nascimento",
    icon: <Calendar size={16} />,
  },
];

// Campos personalizados de exemplo
const initialCustomFields: CustomFieldInterface[] = [
  {
    _id: "1",
    label: "Cargo",
    type: "text",
    placeholder: "Seu cargo atual",
    required: true,
    maskType: "none",
    mask: "",
  },
  {
    _id: "2",
    label: "Empresa",
    type: "text",
    placeholder: "Nome da empresa",
    required: true,
    maskType: "none",
    mask: "",
  },
  {
    _id: "3",
    label: "Interesse",
    type: "text",
    placeholder: "Seus interesses",
    required: false,
    maskType: "none",
    mask: "",
  },
];

export default function EventArrivalsPage() {
  const [arrivals, setArrivals] = useState<EventArrival[]>(mockArrivals);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isConfigMode, setIsConfigMode] = useState(true);
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "name",
    "instagram",
  ]);
  const [customFields, setCustomFields] =
    useState<CustomFieldInterface[]>(initialCustomFields);
  const [selectedCustomFields, setSelectedCustomFields] = useState<string[]>([
    "cargo",
    "empresa",
  ]);
  const [showArrivalTime, setShowArrivalTime] = useState(true);
  const [cardStyle, setCardStyle] = useState<"grid" | "list">("grid");
  const [previewMode, setPreviewMode] = useState(false);
  const [customFieldValues] = useState<
    Record<string, string>
  >({});
  console.log(customFieldValues);

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatArrivalTime = (arrivalTime: string) => {
    return new Date(arrivalTime).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (result.type === "defaultFields") {
      const items = Array.from(selectedFields);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setSelectedFields(items);
    } else if (result.type === "customFields") {
      const items = Array.from(selectedCustomFields);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setSelectedCustomFields(items);
    }
  };

  // const handleCustomFieldChange = (fieldId: string, value: string) => {
  //   setCustomFieldValues((prev) => ({
  //     ...prev,
  //     [fieldId]: value,
  //   }));
  // };

  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };

  const toggleCustomField = (fieldId: string) => {
    if (selectedCustomFields.includes(fieldId)) {
      setSelectedCustomFields(
        selectedCustomFields.filter((id) => id !== fieldId)
      );
    } else {
      setSelectedCustomFields([...selectedCustomFields, fieldId]);
    }
  };

  const addNewCustomField = () => {
    const newField: CustomFieldInterface = {
      _id: `custom-${Date.now()}`,
      label: "Novo Campo",
      type: "text",
      placeholder: "",
      required: false,
      maskType: "none",
      mask: "",
    };
    setCustomFields([...customFields, newField]);
    setSelectedCustomFields([
      ...selectedCustomFields,
      newField.label.toLowerCase(),
    ]);
  };

  const updateCustomField = (
    id: string,
    updates: Partial<CustomFieldInterface>
  ) => {
    setCustomFields(
      customFields.map((field) =>
        field._id === id ? { ...field, ...updates } : field
      )
    );
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field._id !== id));
    setSelectedCustomFields(
      selectedCustomFields.filter(
        (fieldId) =>
          !customFields
            .find((f) => f._id === id)
            ?.label.toLowerCase()
            .includes(fieldId)
      )
    );
  };

  const saveConfiguration = () => {
    setIsConfigMode(false);
    // Aqui você poderia salvar a configuração no backend
  };

  const getFieldValue = (arrival: EventArrival, fieldId: string) => {
    if (fieldId === "birthdaydata") {
      return formatDate(arrival[fieldId]);
    }
    return arrival[fieldId as keyof EventArrival] || "";
  };

  const getCustomFieldValue = (arrival: EventArrival, fieldLabel: string) => {
    return arrival.customFields?.[fieldLabel.toLowerCase()] || "";
  };

  const getFieldIcon = (fieldId: string) => {
    const field = defaultFields.find((f) => f.id === fieldId);
    return field?.icon || <Info size={16} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-[#02488C] mb-2">
                {eventData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#02488C]" />
                  <span className="text-sm">{eventData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#02488C]" />
                  <span className="text-sm">{eventData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#02488C]" />
                  <span className="text-sm">{eventData.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-mono font-bold text-gray-800">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs text-gray-500">Horário atual</div>
              </div>

              <button
                onClick={() => setIsConfigMode(!isConfigMode)}
                className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  isConfigMode
                    ? "bg-[#FEC800] text-gray-800 hover:bg-[#e0b000]"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Settings size={18} />
                <span>
                  {isConfigMode ? "Salvar Configuração" : "Configurar"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isConfigMode ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Configuração de Exibição
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1.5 text-sm"
                  >
                    <Eye size={16} />
                    <span>
                      {previewMode ? "Ocultar Preview" : "Mostrar Preview"}
                    </span>
                  </button>
                  <button
                    onClick={saveConfiguration}
                    className="px-3 py-1.5 rounded-md bg-[#02488C] text-white hover:bg-[#023e7a] flex items-center gap-1.5 text-sm"
                  >
                    <Save size={16} />
                    <span>Salvar Configuração</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Coluna de Configuração */}
                <div className="space-y-6">
                  {/* Estilo de Exibição */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Estilo de Exibição
                    </h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setCardStyle("grid")}
                        className={`flex-1 p-3 rounded-md border-2 flex flex-col items-center gap-2 ${
                          cardStyle === "grid"
                            ? "border-[#FEC800] bg-[#FEC800]/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="grid grid-cols-2 gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-6 h-6 bg-gray-300 rounded"
                            ></div>
                          ))}
                        </div>
                        <span className="text-sm font-medium">Grid</span>
                      </button>
                      <button
                        onClick={() => setCardStyle("list")}
                        className={`flex-1 p-3 rounded-md border-2 flex flex-col items-center gap-2 ${
                          cardStyle === "list"
                            ? "border-[#FEC800] bg-[#FEC800]/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="w-full h-4 bg-gray-300 rounded"
                            ></div>
                          ))}
                        </div>
                        <span className="text-sm font-medium">Lista</span>
                      </button>
                    </div>
                  </div>

                  {/* Campos Padrão */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Campos Padrão
                    </h3>
                    <div className="space-y-2">
                      {defaultFields.map((field) => (
                        <div
                          key={field.id}
                          className={`p-3 rounded-md border flex items-center justify-between ${
                            selectedFields.includes(field.id)
                              ? "border-[#02488C] bg-[#02488C]/5"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-gray-500">{field.icon}</div>
                            <span className="font-medium">{field.label}</span>
                          </div>
                          <button
                            onClick={() => toggleField(field.id)}
                            className={`p-1.5 rounded-md ${
                              selectedFields.includes(field.id)
                                ? "bg-[#02488C] text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {selectedFields.includes(field.id) ? (
                              <Check size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Opções Adicionais */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Opções Adicionais
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock size={18} className="text-gray-500" />
                          <span>Mostrar horário de chegada</span>
                        </div>
                        <button
                          onClick={() => setShowArrivalTime(!showArrivalTime)}
                          className={`p-1.5 rounded-md ${
                            showArrivalTime
                              ? "bg-[#02488C] text-white"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {showArrivalTime ? (
                            <Check size={16} />
                          ) : (
                            <X size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna de Campos Personalizados */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        Campos Personalizados
                      </h3>
                      <button
                        onClick={addNewCustomField}
                        className="px-3 py-1.5 rounded-md bg-[#FEC800] text-gray-800 hover:bg-[#e0b000] flex items-center gap-1.5 text-sm"
                      >
                        <Plus size={16} />
                        <span>Adicionar Campo</span>
                      </button>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable
                        droppableId="customFieldsList"
                        type="customFields"
                      >
                        {(
                          provided: DroppableProvided,                          
                        ) => (
                          <div
                            className="space-y-3"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {customFields.map((field, index) => (
                              <Draggable
                                key={field._id}
                                draggableId={field._id}
                                index={index}
                              >
                                {(
                                  provided: DraggableProvided,                                  
                                ) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`p-3 rounded-md border ${
                                      selectedCustomFields.includes(
                                        field.label.toLowerCase()
                                      )
                                        ? "border-[#02488C] bg-[#02488C]/5"
                                        : "border-gray-200"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical
                                            size={16}
                                            className="text-gray-400"
                                          />
                                        </div>
                                        <input
                                          type="text"
                                          value={field.label}
                                          onChange={(e) =>
                                            updateCustomField(field._id, {
                                              label: e.target.value,
                                            })
                                          }
                                          className="font-medium bg-transparent border-b border-dashed border-gray-300 focus:border-[#02488C] focus:outline-none px-1"
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() =>
                                            toggleCustomField(
                                              field.label.toLowerCase()
                                            )
                                          }
                                          className={`p-1.5 rounded-md ${
                                            selectedCustomFields.includes(
                                              field.label.toLowerCase()
                                            )
                                              ? "bg-[#02488C] text-white"
                                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                          }`}
                                        >
                                          {selectedCustomFields.includes(
                                            field.label.toLowerCase()
                                          ) ? (
                                            <Check size={16} />
                                          ) : (
                                            <Plus size={16} />
                                          )}
                                        </button>
                                        <button
                                          onClick={() =>
                                            removeCustomField(field._id)
                                          }
                                          className="p-1.5 rounded-md bg-red-100 text-red-500 hover:bg-red-200"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                      <select
                                        value={field.type}
                                        onChange={(e) =>
                                          updateCustomField(field._id, {
                                            type: e.target.value as FieldType,
                                          })
                                        }
                                        className="text-xs p-1 border border-gray-300 rounded bg-white"
                                      >
                                        <option value="text">Texto</option>
                                        <option value="email">Email</option>
                                        <option value="number">Número</option>
                                        <option value="select">Seleção</option>
                                      </select>
                                      <input
                                        type="text"
                                        value={field.placeholder || ""}
                                        onChange={(e) =>
                                          updateCustomField(field._id, {
                                            placeholder: e.target.value,
                                          })
                                        }
                                        placeholder="Placeholder"
                                        className="text-xs p-1 border border-gray-300 rounded flex-1"
                                      />
                                      <div className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id={`required-${field._id}`}
                                          checked={field.required}
                                          onChange={(e) =>
                                            updateCustomField(field._id, {
                                              required: e.target.checked,
                                            })
                                          }
                                          className="mr-1"
                                        />
                                        <label
                                          htmlFor={`required-${field._id}`}
                                          className="text-xs"
                                        >
                                          Obrigatório
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    {customFields.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Nenhum campo personalizado criado</p>
                        <button
                          onClick={addNewCustomField}
                          className="mt-3 px-3 py-1.5 rounded-md bg-[#FEC800] text-gray-800 hover:bg-[#e0b000] text-sm"
                        >
                          Adicionar Campo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {previewMode && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Preview
                      </h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-sm mx-auto">
                        <div className="flex flex-col items-center">
                          <div className="relative mb-4">
                            <div className="w-16 h-16 rounded-full bg-[#02488C] flex items-center justify-center text-white text-xl font-bold">
                              AS
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>

                          {selectedFields.includes("name") && (
                            <h3 className="font-bold text-lg text-gray-800 mb-2">
                              Ana Silva
                            </h3>
                          )}

                          {selectedFields
                            .filter((f) => f !== "name")
                            .map((fieldId) => {
                              const field = defaultFields.find(
                                (f) => f.id === fieldId
                              );
                              if (!field) return null;

                              return (
                                <div
                                  key={fieldId}
                                  className="flex items-center justify-center gap-2 mb-1 text-gray-600"
                                >
                                  {field.icon}
                                  <span className="text-sm">
                                    {fieldId === "instagram"
                                      ? "@ana_silva_dev"
                                      : fieldId === "email"
                                      ? "ana@email.com"
                                      : fieldId === "phoneNumber"
                                      ? "(11) 98765-4321"
                                      : fieldId === "mysite"
                                      ? "anasilva.dev"
                                      : fieldId === "birthdaydata"
                                      ? "15/05/1990"
                                      : ""}
                                  </span>
                                </div>
                              );
                            })}

                          {selectedCustomFields.map((fieldId) => {
                            const field = customFields.find(
                              (f) => f.label.toLowerCase() === fieldId
                            );
                            if (!field) return null;

                            return (
                              <div
                                key={fieldId}
                                className="flex items-center justify-center gap-2 mb-1 text-gray-600"
                              >
                                <Info size={16} />
                                <span className="text-sm">
                                  {fieldId === "cargo"
                                    ? "Desenvolvedora Frontend"
                                    : fieldId === "empresa"
                                    ? "TechCorp"
                                    : fieldId === "interesse"
                                    ? "React, TypeScript"
                                    : field.label}
                                </span>
                              </div>
                            );
                          })}

                          {showArrivalTime && (
                            <div className="flex items-center justify-center gap-2 text-gray-500 mt-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">10:15</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-[#02488C] rounded-full">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Participantes do Evento
                  </h2>
                  <p className="text-sm text-gray-600">
                    Acompanhe em tempo real quem está chegando
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCardStyle(cardStyle === "grid" ? "list" : "grid")
                  }
                  className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {cardStyle === "grid" ? (
                    <List size={18} />
                  ) : (
                    <Grid size={18} />
                  )}
                </button>
                <button
                  onClick={() => setArrivals([...arrivals])}
                  className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {arrivals.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                  <UserCheck className="h-10 w-10 text-[#02488C]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Aguardando Chegadas
                </h2>
                <p className="text-gray-600 text-lg">
                  As chegadas dos participantes aparecerão aqui em tempo real
                </p>
              </div>
            ) : (
              <div
                className={
                  cardStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {arrivals.map((arrival) => (
                  <div
                    key={arrival._id}
                    className={`
                      bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md
                      ${
                        cardStyle === "list"
                          ? "flex items-center p-4 gap-4"
                          : ""
                      }
                      ${
                        arrival.isNew
                          ? "animate-pulse border-green-400 shadow-sm"
                          : ""
                      }
                    `}
                  >
                    <div
                      className={`
                      ${
                        cardStyle === "list"
                          ? "flex-shrink-0"
                          : "p-6 text-center"
                      }
                    `}
                    >
                      <div
                        className={`
                        relative 
                        ${cardStyle === "list" ? "" : "mx-auto mb-4"}
                      `}
                      >
                        <div
                          className={`
                          rounded-full bg-[#02488C] flex items-center justify-center text-white font-bold
                          ${
                            cardStyle === "list"
                              ? "w-12 h-12 text-sm"
                              : "w-16 h-16 text-xl"
                          }
                        `}
                        >
                          {getInitials(arrival.name)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                    </div>

                    <div
                      className={`
                      ${
                        cardStyle === "list"
                          ? "flex-1"
                          : "text-center px-4 pb-6"
                      }
                    `}
                    >
                      {selectedFields.includes("name") && (
                        <h3
                          className={`
                          font-bold text-gray-800 
                          ${
                            cardStyle === "list"
                              ? "text-base mb-1"
                              : "text-lg mb-2"
                          }
                        `}
                        >
                          {arrival.name}
                        </h3>
                      )}

                      <div
                        className={`
                        space-y-1
                        ${
                          cardStyle === "list"
                            ? "flex flex-wrap gap-x-4 gap-y-1"
                            : ""
                        }
                      `}
                      >
                        {selectedFields
                          .filter((f) => f !== "name")
                          .map((fieldId) => {
                            const value = getFieldValue(arrival, fieldId);
                            if (!value) return null;

                            return (
                              <div
                                key={fieldId}
                                className={`
                                flex items-center gap-2 text-gray-600
                                ${
                                  cardStyle === "list"
                                    ? "text-xs"
                                    : "justify-center text-sm"
                                }
                              `}
                              >
                                {getFieldIcon(fieldId)}
                                <span>{value.toString()}</span>
                              </div>
                            );
                          })}

                        {selectedCustomFields.map((fieldId) => {
                          const value = getCustomFieldValue(arrival, fieldId);
                          if (!value) return null;

                          return (
                            <div
                              key={fieldId}
                              className={`
                                flex items-center gap-2 text-gray-600
                                ${
                                  cardStyle === "list"
                                    ? "text-xs"
                                    : "justify-center text-sm"
                                }
                              `}
                            >
                              <Info size={cardStyle === "list" ? 14 : 16} />
                              <span>{value}</span>
                            </div>
                          );
                        })}
                      </div>

                      {showArrivalTime && (
                        <div
                          className={`
                          flex items-center gap-2 text-gray-500
                          ${
                            cardStyle === "list"
                              ? "text-xs mt-2"
                              : "justify-center text-sm mt-3"
                          }
                        `}
                        >
                          <Clock
                            className={`${
                              cardStyle === "list" ? "h-3 w-3" : "h-4 w-4"
                            }`}
                          />
                          <span>{formatArrivalTime(arrival.arrivalTime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
