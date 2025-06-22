import { useState, useEffect } from "react"
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DroppableProvided,
  type DraggableProvided,
} from "react-beautiful-dnd"
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
  LogOut,
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
  Users,
  Sparkles,
} from "lucide-react"
import type CustomFieldInterface from "../interfaces/CustomFieldInterface"
import type { FieldType } from "../interfaces/CustomFieldInterface"

interface UserTicketsInterface {
  _id: string
  eventId: string
  ticketType: string
  purchaseDate: string
  isUsed: boolean
}

interface UserInterface {
  _id: string
  name: string
  cpf: string
  email: string
  emailVerified: string
  birthdaydata: string
  type: "user" | "superUser" | "admin"
  mysite: string
  instagram: string
  facebook: string
  phoneNumber: string
  avatar: string
  tickets: UserTicketsInterface[]
  customFields?: Record<string, string>
}

interface EventArrival extends UserInterface {
  arrivalTime: string
  isNew: boolean
}

// Mock data para o evento
const eventData = {
  title: "Workshop de React Avançado 2024",
  date: "15 de Janeiro, 2024",
  time: "09:00 - 18:00",
  location: "Centro de Convenções - São Paulo",
  totalParticipants: 156,
  checkedIn: 3,
}

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
    arrivalTime: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
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
    arrivalTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    isNew: false,
    customFields: {
      cargo: "UX Designer",
      empresa: "DesignStudio",
      interesse: "UI/UX, Figma",
    },
  },
]

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
]

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
]

export default function EventArrivalsPage() {
  const [arrivals] = useState<EventArrival[]>(mockArrivals)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isConfigMode, setIsConfigMode] = useState(true)
  const [selectedFields, setSelectedFields] = useState<string[]>(["name", "instagram"])
  const [customFields, setCustomFields] = useState<CustomFieldInterface[]>(initialCustomFields)
  const [selectedCustomFields, setSelectedCustomFields] = useState<string[]>(["cargo", "empresa"])
  const [showArrivalTime, setShowArrivalTime] = useState(true)
  const [cardStyle, setCardStyle] = useState<"grid" | "list">("grid")
  const [previewMode, setPreviewMode] = useState(false)
  const [commonParameter, setCommonParameter] = useState<string>("")

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatArrivalTime = (arrivalTime: string) => {
    return new Date(arrivalTime).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    if (result.type === "defaultFields") {
      const items = Array.from(selectedFields)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setSelectedFields(items)
    } else if (result.type === "customFields") {
      const items = Array.from(selectedCustomFields)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setSelectedCustomFields(items)
    }
  }

  const toggleField = (fieldId: string) => {
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter((id) => id !== fieldId))
    } else {
      setSelectedFields([...selectedFields, fieldId])
    }
  }

  const toggleCustomField = (fieldId: string) => {
    if (selectedCustomFields.includes(fieldId)) {
      setSelectedCustomFields(selectedCustomFields.filter((id) => id !== fieldId))
    } else {
      setSelectedCustomFields([...selectedCustomFields, fieldId])
    }
  }

  const addNewCustomField = () => {
    const newField: CustomFieldInterface = {
      _id: `custom-${Date.now()}`,
      label: "Novo Campo",
      type: "text",
      placeholder: "",
      required: false,
      maskType: "none",
      mask: "",
    }
    setCustomFields([...customFields, newField])
    setSelectedCustomFields([...selectedCustomFields, newField.label.toLowerCase()])
  }

  const updateCustomField = (id: string, updates: Partial<CustomFieldInterface>) => {
    setCustomFields(customFields.map((field) => (field._id === id ? { ...field, ...updates } : field)))
  }

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field._id !== id))
    setSelectedCustomFields(
      selectedCustomFields.filter(
        (fieldId) =>
          !customFields
            .find((f) => f._id === id)
            ?.label.toLowerCase()
            .includes(fieldId),
      ),
    )
  }

  const saveConfiguration = () => {
    setIsConfigMode(false)
    // Aqui você poderia salvar a configuração no backend
  }

  const exitCheckout = () => {
    // Função para sair da visualização de checkout
    window.history.back()
  }

  const getFieldValue = (arrival: EventArrival, fieldId: string) => {
    if (fieldId === "birthdaydata") {
      return formatDate(arrival[fieldId])
    }
    return arrival[fieldId as keyof EventArrival] || ""
  }

  const getCustomFieldValue = (arrival: EventArrival, fieldLabel: string) => {
    return arrival.customFields?.[fieldLabel.toLowerCase()] || ""
  }

  const getFieldIcon = (fieldId: string) => {
    const field = defaultFields.find((f) => f.id === fieldId)
    return field?.icon || <Info size={16} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header Profissional */}
      <div className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#02488C] to-[#0369a1] rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{eventData.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Ativo
                    </span>
                    <span>•</span>
                    <span>
                      {eventData.checkedIn} de {eventData.totalParticipants} participantes
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#02488C]" />
                  <div>
                    <div className="font-medium text-gray-900">{eventData.date}</div>
                    <div className="text-gray-500">{eventData.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#02488C]" />
                  <div>
                    <div className="font-medium text-gray-900">Local</div>
                    <div className="text-gray-500">{eventData.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-[#02488C]" />
                  <div>
                    <div className="font-medium text-gray-900">Horário Atual</div>
                    <div className="text-gray-500 font-mono">{formatTime(currentTime)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {!isConfigMode && (
                <button
                  onClick={exitCheckout}
                  className="px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                >
                  <LogOut size={18} />
                  <span>Sair</span>
                </button>
              )}

              <button
                onClick={() => setIsConfigMode(!isConfigMode)}
                className={`px-4 sm:px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition-all duration-200 shadow-sm text-sm sm:text-base ${
                  isConfigMode
                    ? "bg-gradient-to-r from-[#FEC800] to-[#f59e0b] text-gray-900 hover:from-[#e0b000] hover:to-[#d97706] shadow-md"
                    : "bg-gradient-to-r from-[#02488C] to-[#0369a1] text-white hover:from-[#023e7a] hover:to-[#0284c7] shadow-md"
                }`}
              >
                <Settings size={18} />
                <span className="whitespace-nowrap">
                  {isConfigMode ? "Finalizar Configuração" : "Configurar Exibição"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {isConfigMode ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#02488C] to-[#0369a1] rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Configuração de Exibição</h2>
                    <p className="text-gray-600 mt-1">
                      Personalize como os participantes serão exibidos durante o evento
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-3 sm:px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm text-sm"
                  >
                    <Eye size={16} />
                    <span className="whitespace-nowrap">{previewMode ? "Ocultar Preview" : "Mostrar Preview"}</span>
                  </button>
                  <button
                    onClick={saveConfiguration}
                    className="px-4 sm:px-6 py-2 rounded-lg bg-gradient-to-r from-[#02488C] to-[#0369a1] text-white hover:from-[#023e7a] hover:to-[#0284c7] transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md text-sm"
                  >
                    <Save size={16} />
                    <span className="whitespace-nowrap">Salvar Configuração</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Coluna de Configuração */}
                <div className="space-y-8">
                  {/* Estilo de Exibição */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Grid className="h-5 w-5 text-[#02488C]" />
                      Estilo de Exibição
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setCardStyle("grid")}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          cardStyle === "grid"
                            ? "border-[#FEC800] bg-[#FEC800]/10 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`w-full h-6 rounded ${
                                cardStyle === "grid" ? "bg-[#FEC800]/30" : "bg-gray-300"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">Grid</span>
                      </button>
                      <button
                        onClick={() => setCardStyle("list")}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          cardStyle === "list"
                            ? "border-[#FEC800] bg-[#FEC800]/10 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="space-y-2 mb-3">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`w-full h-4 rounded ${
                                cardStyle === "list" ? "bg-[#FEC800]/30" : "bg-gray-300"
                              }`}
                            ></div>
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">Lista</span>
                      </button>
                    </div>
                  </div>

                  {/* Campos Padrão */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <User className="h-5 w-5 text-[#02488C]" />
                      Campos Padrão
                    </h3>
                    <div className="space-y-3">
                      {defaultFields.map((field) => (
                        <div
                          key={field.id}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedFields.includes(field.id)
                              ? "border-[#02488C] bg-[#02488C]/5 shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  selectedFields.includes(field.id)
                                    ? "bg-[#02488C] text-white"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              >
                                {field.icon}
                              </div>
                              <span className="font-medium text-gray-900">{field.label}</span>
                            </div>
                            <button
                              onClick={() => toggleField(field.id)}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                selectedFields.includes(field.id)
                                  ? "bg-[#02488C] text-white shadow-md"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                            >
                              {selectedFields.includes(field.id) ? <Check size={16} /> : <Plus size={16} />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Parâmetro Comum */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50/30 p-6 rounded-xl border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#FEC800]" />
                      Parâmetro Comum
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Adicione um parâmetro que será exibido para todos os participantes
                    </p>
                    <input
                      type="text"
                      value={commonParameter}
                      onChange={(e) => setCommonParameter(e.target.value)}
                      placeholder="Ex: VIP, Palestrante, Patrocinador..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FEC800] focus:border-[#FEC800] transition-all duration-200"
                    />
                  </div>

                  {/* Opções Adicionais */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-[#02488C]" />
                      Opções Adicionais
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Clock size={18} className="text-gray-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">Horário de chegada</span>
                            <p className="text-sm text-gray-500">Mostrar quando cada participante chegou</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowArrivalTime(!showArrivalTime)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            showArrivalTime
                              ? "bg-[#02488C] text-white shadow-md"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {showArrivalTime ? <Check size={16} /> : <X size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna de Campos Personalizados */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Info className="h-5 w-5 text-[#02488C]" />
                        Campos Personalizados
                      </h3>
                      <button
                        onClick={addNewCustomField}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FEC800] to-[#f59e0b] text-gray-900 hover:from-[#e0b000] hover:to-[#d97706] transition-all duration-200 flex items-center gap-2 font-medium shadow-md"
                      >
                        <Plus size={16} />
                        <span>Adicionar Campo</span>
                      </button>
                    </div>

                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="customFieldsList" type="customFields">
                        {(provided: DroppableProvided) => (
                          <div className="space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
                            {customFields.map((field, index) => (
                              <Draggable key={field._id} draggableId={field._id} index={index}>
                                {(provided: DraggableProvided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 bg-white ${
                                      selectedCustomFields.includes(field.label.toLowerCase())
                                        ? "border-[#02488C] shadow-sm"
                                        : "border-gray-200"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="cursor-grab hover:cursor-grabbing"
                                        >
                                          <GripVertical size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                          type="text"
                                          value={field.label}
                                          onChange={(e) =>
                                            updateCustomField(field._id, {
                                              label: e.target.value,
                                            })
                                          }
                                          className="font-medium bg-transparent border-b-2 border-dashed border-gray-300 focus:border-[#02488C] focus:outline-none px-2 py-1 text-gray-900"
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => toggleCustomField(field.label.toLowerCase())}
                                          className={`p-2 rounded-lg transition-all duration-200 ${
                                            selectedCustomFields.includes(field.label.toLowerCase())
                                              ? "bg-[#02488C] text-white shadow-md"
                                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                          }`}
                                        >
                                          {selectedCustomFields.includes(field.label.toLowerCase()) ? (
                                            <Check size={16} />
                                          ) : (
                                            <Plus size={16} />
                                          )}
                                        </button>
                                        <button
                                          onClick={() => removeCustomField(field._id)}
                                          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <select
                                        value={field.type}
                                        onChange={(e) =>
                                          updateCustomField(field._id, {
                                            type: e.target.value as FieldType,
                                          })
                                        }
                                        className="text-sm p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#02488C] focus:border-[#02488C]"
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
                                        className="text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02488C] focus:border-[#02488C]"
                                      />
                                    </div>
                                    <div className="flex items-center mt-3">
                                      <input
                                        type="checkbox"
                                        id={`required-${field._id}`}
                                        checked={field.required}
                                        onChange={(e) =>
                                          updateCustomField(field._id, {
                                            required: e.target.checked,
                                          })
                                        }
                                        className="mr-2 w-4 h-4 text-[#02488C] bg-gray-100 border-gray-300 rounded focus:ring-[#02488C] focus:ring-2"
                                      />
                                      <label htmlFor={`required-${field._id}`} className="text-sm text-gray-700">
                                        Campo obrigatório
                                      </label>
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
                      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum campo personalizado</h4>
                        <p className="text-gray-600 mb-4">
                          Adicione campos personalizados para coletar informações específicas
                        </p>
                        <button
                          onClick={addNewCustomField}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FEC800] to-[#f59e0b] text-gray-900 hover:from-[#e0b000] hover:to-[#d97706] transition-all duration-200 font-medium shadow-md"
                        >
                          Adicionar Campo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {previewMode && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 rounded-xl border border-blue-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-[#02488C]" />
                        Preview
                      </h3>
                      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-sm mx-auto shadow-lg">
                        <div className="flex flex-col items-center">
                          <div className="relative mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#02488C] to-[#0369a1] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                              AS
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>

                          {selectedFields.includes("name") && (
                            <h3 className="font-bold text-lg text-gray-900 mb-3">Ana Silva</h3>
                          )}

                          <div className="space-y-2 w-full">
                            {selectedFields
                              .filter((f) => f !== "name")
                              .map((fieldId) => {
                                const field = defaultFields.find((f) => f.id === fieldId)
                                if (!field) return null

                                return (
                                  <div
                                    key={fieldId}
                                    className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-2"
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
                                )
                              })}

                            {selectedCustomFields.map((fieldId) => {
                              const field = customFields.find((f) => f.label.toLowerCase() === fieldId)
                              if (!field) return null

                              return (
                                <div
                                  key={fieldId}
                                  className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-2"
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
                              )
                            })}

                            {commonParameter && (
                              <div className="flex items-center justify-center gap-2 text-[#FEC800] bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                                <Sparkles size={16} />
                                <span className="text-sm font-medium">{commonParameter}</span>
                              </div>
                            )}
                          </div>

                          {showArrivalTime && (
                            <div className="flex items-center justify-center gap-2 text-gray-500 mt-4 bg-gray-50 rounded-lg p-2">
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#02488C] to-[#0369a1] rounded-xl shadow-lg">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Participantes Presentes</h2>
                  <p className="text-gray-600">Acompanhe em tempo real as chegadas do evento</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">{arrivals.length} presentes</span>
                </div>
                <button
                  onClick={() => setCardStyle(cardStyle === "grid" ? "list" : "grid")}
                  className="p-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm flex items-center justify-center"
                >
                  {cardStyle === "grid" ? <List size={18} /> : <Grid size={18} />}
                </button>
              </div>
            </div>

            {arrivals.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
                  <UserCheck className="h-12 w-12 text-[#02488C]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Aguardando Chegadas</h2>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  As chegadas dos participantes aparecerão aqui em tempo real conforme eles fizerem check-in
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
                      bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300
                      ${cardStyle === "list" ? "flex items-center p-6 gap-6" : "shadow-sm"}
                      ${arrival.isNew ? "animate-pulse border-green-400 shadow-md bg-green-50/30" : ""}
                    `}
                  >
                    <div
                      className={`
                      ${cardStyle === "list" ? "flex-shrink-0" : "p-6 text-center"}
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
                          rounded-full bg-gradient-to-br from-[#02488C] to-[#0369a1] flex items-center justify-center text-white font-bold shadow-lg
                          ${cardStyle === "list" ? "w-14 h-14 text-sm" : "w-16 h-16 text-xl"}
                        `}
                        >
                          {getInitials(arrival.name)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                      </div>
                    </div>

                    <div
                      className={`
                      ${cardStyle === "list" ? "flex-1" : "text-center px-6 pb-6"}
                    `}
                    >
                      {selectedFields.includes("name") && (
                        <h3
                          className={`
                          font-bold text-gray-900 
                          ${cardStyle === "list" ? "text-lg mb-2" : "text-lg mb-3"}
                        `}
                        >
                          {arrival.name}
                        </h3>
                      )}

                      <div
                        className={`
                        space-y-2
                        ${cardStyle === "list" ? "grid grid-cols-2 gap-x-6 gap-y-2" : ""}
                      `}
                      >
                        {selectedFields
                          .filter((f) => f !== "name")
                          .map((fieldId) => {
                            const value = getFieldValue(arrival, fieldId)
                            if (!value) return null

                            return (
                              <div
                                key={fieldId}
                                className={`
                                flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-2
                                ${cardStyle === "list" ? "text-sm" : "justify-center text-sm"}
                              `}
                              >
                                {getFieldIcon(fieldId)}
                                <span className="truncate">{value.toString()}</span>
                              </div>
                            )
                          })}

                        {selectedCustomFields.map((fieldId) => {
                          const value = getCustomFieldValue(arrival, fieldId)
                          if (!value) return null

                          return (
                            <div
                              key={fieldId}
                              className={`
                                flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-2
                                ${cardStyle === "list" ? "text-sm" : "justify-center text-sm"}
                              `}
                            >
                              <Info size={cardStyle === "list" ? 14 : 16} />
                              <span className="truncate">{value}</span>
                            </div>
                          )
                        })}

                        {commonParameter && (
                          <div
                            className={`
                              flex items-center gap-2 text-[#FEC800] bg-yellow-50 rounded-lg p-2 border border-yellow-200
                              ${cardStyle === "list" ? "text-sm" : "justify-center text-sm"}
                            `}
                          >
                            <Sparkles size={cardStyle === "list" ? 14 : 16} />
                            <span className="font-medium">{commonParameter}</span>
                          </div>
                        )}
                      </div>

                      {showArrivalTime && (
                        <div
                          className={`
                          flex items-center gap-2 text-gray-500 bg-gray-50 rounded-lg p-2 mt-3
                          ${cardStyle === "list" ? "text-sm" : "justify-center text-sm"}
                        `}
                        >
                          <Clock className={`${cardStyle === "list" ? "h-3 w-3" : "h-4 w-4"}`} />
                          <span className="font-mono">{formatArrivalTime(arrival.arrivalTime)}</span>
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
  )
}
