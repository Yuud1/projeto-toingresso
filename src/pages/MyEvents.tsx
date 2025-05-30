import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Pencil,
  Trash2,
  Eye,
  Search,
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  ChevronDown,
  Home,
  BarChart3,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import DeleteModal from "@/components/deleteModal"
import GenericModal from "@/components/genericModal"
import { EditEventModal } from "@/components/editEventModal"
import axios from "axios"
import type EventInterface from "@/interfaces/EventInterface"
import { useUser } from "@/contexts/useContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TabProps {
  isActive: boolean
  children: React.ReactNode
  onClick: () => void
  className?: string
}

const Tab = ({ isActive, children, onClick, className }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative",
        isActive ? "text-[#02488C]" : "text-gray-500 hover:text-gray-700",
        className,
      )}
    >
      {children}
      {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />}
    </button>
  )
}

// Opções para os tabs principais
const mainTabOptions = [
  { value: "inicio", label: "Início", icon: Home },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
] as const

// Opções para os subtabs
const subTabOptions = [
  { value: "active", label: "Ativos" },
  { value: "editing", label: "Editando" },
  { value: "finished", label: "Encerrados" },
] as const

// Gerar dados de receita por mês
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export default function MyEvents() {
  const token = localStorage.getItem("token")
  const { user } = useUser()

  const [events, setEvents] = useState<EventInterface[]>([])
  const [mainTab, setMainTab] = useState<"inicio" | "dashboard">("inicio")
  const [subTab, setSubTab] = useState<"active" | "finished" | "editing">("active")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<EventInterface | null>(null)

  //  Calculo do revenue atualizado da silva
  const revenueData = months.map((month, idx) => {
    const monthRevenue = events
      .filter((e) => new Date(e.startDate).getMonth() === idx)
      .reduce((acc, event) => {
        const eventRevenue = event.tickets.reduce(
          (ticketAcc, ticket) => ticketAcc + ticket.price * ticket.soldQuantity,
          0,
        )
        return acc + eventRevenue
      }, 0)

    return { name: month, revenue: monthRevenue }
  })

  // Get eventos do usuário
  useEffect(() => {
    async function getEvents() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_USER_EVENTS}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.data.events) {
          setEvents(response.data.events)
        }
      } catch (error) {
        console.log("Error", error)
      }
    }

    getEvents()
  }, [user, token])

  const filteredEvents = events.filter((event) => {
    const matchesTab = event.status === subTab
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  const dashboardMetrics = {
    totalEvents: events.length,
    activeEvents: events.filter((e) => e.status === "active").length,
    totalRevenue: events.reduce((acc, event) => {
      const eventRevenue = event.tickets.reduce(
        (ticketAcc, ticket) => ticketAcc + ticket.price * ticket.soldQuantity,
        0,
      )
      return acc + eventRevenue
    }, 0),
    totalTicketsSold: events.reduce((acc, event) => {
      const eventTicketsSold = event.tickets.reduce((ticketAcc, ticket) => ticketAcc + ticket.soldQuantity, 0)
      return acc + eventTicketsSold
    }, 0),
    upcomingEvents: events.filter((e) => new Date(e.startDate) > new Date() && e.status === "active").length,
  }

  const handleEdit = (eventId: string) => {
    const event = events.find((e) => e._id === eventId)
    if (event) {
      setSelectedEvent(event)
      setIsEditModalOpen(true)
    }
  }

  const handleSaveEvent = (updatedEvent: EventInterface) => {
    setEvents((prevEvents) => prevEvents.map((event) => (event._id === updatedEvent._id ? updatedEvent : event)))
    setIsEditModalOpen(false)
  }

  const handleDelete = async (eventId: string) => {
    try {
      setEventToDelete(eventId)
      setIsDeleteModalOpen(true)
    } catch (error) {
      console.log("Erro", error)
    }
  }

  const confirmDelete = async () => {
    if (eventToDelete) {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_EVENT_DELETE}`, {
        data: { id: eventToDelete },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.deleted) {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventToDelete))
        setEventToDelete(null)
        setIsDeleteModalOpen(false)
      }
    }
  }

  const handleView = (eventId: string) => {
    const event = events.find((e) => e._id === eventId)
    if (event) {
      setSelectedEvent(event)
      setIsViewModalOpen(true)
    }
  }

  // Função para obter o label do subtab atual
  const getCurrentSubTabLabel = () => {
    return subTabOptions.find((option) => option.value === subTab)?.label || "Ativos"
  }

  // Função para obter o label do tab principal atual
  const getCurrentMainTabLabel = () => {
    return mainTabOptions.find((option) => option.value === mainTab)?.label || "Início"
  }

  // Função para obter o ícone do tab principal atual
  const getCurrentMainTabIcon = () => {
    const TabIcon = mainTabOptions.find((option) => option.value === mainTab)?.icon || Home
    return <TabIcon className="h-4 w-4 mr-2" />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Excluir Evento"
          description="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        />

        <GenericModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={selectedEvent?.title || "Detalhes do Evento"}
          showFooter={false}
        >
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Data</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedEvent.startDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Local</h4>
                <p className="text-sm text-gray-600">{selectedEvent.neighborhood}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Descrição</h4>
                <p className="text-sm text-gray-600">{selectedEvent.description}</p>
              </div>
              {selectedEvent.status !== "editing" &&
                selectedEvent.tickets.map((ticket, index) => {
                  return (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Ingressos Vendidos</h4>
                        <p className="text-sm text-gray-600">
                          {ticket.soldQuantity} / {ticket.quantity}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Receita</h4>
                        <p className="text-sm text-gray-600">
                          R${" "}
                          {(ticket.soldQuantity * ticket.quantity).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p className="text-sm text-gray-600 capitalize">{selectedEvent.status}</p>
              </div>
            </div>
          )}
        </GenericModal>

        <EditEventModal
          event={selectedEvent}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEvent}
        />

        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">Meus Eventos</h1>

            {/* Desktop Tabs */}
            <div className="hidden md:flex space-x-4">
              {mainTabOptions.map((option) => (
                <Tab
                  key={option.value}
                  isActive={mainTab === option.value}
                  onClick={() => setMainTab(option.value as "inicio" | "dashboard")}
                  className="text-base cursor-pointer"
                >
                  <div className="flex items-center">
                    <option.icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </div>
                </Tab>
              ))}
            </div>

            {/* Mobile Dropdown para tabs principais */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    {getCurrentMainTabIcon()}
                    {getCurrentMainTabLabel()}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {mainTabOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={cn("cursor-pointer", mainTab === option.value && "bg-muted")}
                      onClick={() => setMainTab(option.value as "inicio" | "dashboard")}
                    >
                      <div className="flex items-center">
                        <option.icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {mainTab === "inicio" && (
            <>
              <div className="flex flex-col gap-4 mb-6">
                {/* Mobile Dropdown para subtabs */}
                <div className="md:hidden w-full mb-2">
                  <Select
                    value={subTab}
                    onValueChange={(value) => setSubTab(value as "active" | "editing" | "finished")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={getCurrentSubTabLabel()} />
                    </SelectTrigger>
                    <SelectContent>
                      {subTabOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Desktop Subtabs */}
                <div className="hidden md:flex space-x-6">
                  {subTabOptions.map((option) => (
                    <Tab
                      key={option.value}
                      isActive={subTab === option.value}
                      onClick={() => setSubTab(option.value as "active" | "editing" | "finished")}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </Tab>
                  ))}
                </div>

                {/* Barra de pesquisa */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Buscar eventos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-600 mb-4">Não há eventos {getCurrentSubTabLabel().toLowerCase()}</p>
                  <Button
                    onClick={() => (window.location.href = "/criar-evento")}
                    className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
                  >
                    CRIAR EVENTO
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <Card key={event._id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                        <CardDescription>{new Date(event.startDate).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-1">{event.neighborhood}</p>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleView(event._id)}
                            className="cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(event._id)}
                            className="cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(event._id)}
                            className="cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {mainTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardMetrics.totalEvents}</div>
                    <p className="text-xs text-muted-foreground">{dashboardMetrics.activeEvents} eventos ativos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingressos Vendidos</CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardMetrics.totalTicketsSold}</div>
                    <p className="text-xs text-muted-foreground">Em todos os eventos</p>
                  </CardContent>
                </Card>
                <Card className="col-span-2 sm:col-span-2 lg:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {dashboardMetrics.totalRevenue.toLocaleString("pt-BR")}</div>
                    <p className="text-xs text-muted-foreground">Em todos os eventos</p>
                  </CardContent>
                </Card>
                <Card className="col-span-2 sm:col-span-2 lg:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardMetrics.upcomingEvents}</div>
                    <p className="text-xs text-muted-foreground">Eventos futuros</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>Receita por mês</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[240px] sm:h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData} style={{ fontSize: 12 }}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} dy={8} />
                          <YAxis axisLine={false} tickLine={false} width={60} tickFormatter={(v) => `R$${v}`} />
                          <Bar dataKey="revenue" fill="#222" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
