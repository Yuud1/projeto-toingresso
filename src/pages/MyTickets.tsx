import type React from "react"

import { useState, useMemo, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Search, ArrowRightLeft, Eye } from "lucide-react"
import { useUser } from "@/contexts/useContext"
import type UserTicketsInterface from "@/interfaces/UserTicketsInterface"
import Subscribed from "./Subscribed"

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
        "px-4 py-2 text-sm font-medium transition-colors relative cursor-pointer",
        isActive ? "text-[#02488C]" : "text-gray-500 hover:text-gray-700",
        className,
      )}
    >
      {children}
      {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />}
    </button>
  )
}

const statusOptions = [
  { value: "ativo", label: "Ativos" },
  { value: "encerrado", label: "Encerrados" },
] as const

export default function MyTickets() {
  const { user } = useUser()

  // Todos os hooks devem estar no topo, antes de qualquer early return
  const [activeTab, setActiveTab] = useState<"ativo" | "encerrado">("ativo")
  const [searchQuery, setSearchQuery] = useState("")
  const [tickets, setTickets] = useState<UserTicketsInterface[] | undefined>(user?.tickets)
  const [openModalTicket, setOpenModalTicket] = useState(false)
  const [ticketIdClicked, setTicketIdClicked] = useState<string | undefined>(undefined)

  useEffect(() => {
    setTickets(user?.tickets)
  }, [user])

  const filteredTickets = useMemo(() => {
    if (!tickets) return []

    return tickets.filter((ticket) => {
      const matchesTab = ticket.status === activeTab
      const matchesSearch =
        searchQuery === "" ||
        ticket.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.Owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket._id.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesTab && matchesSearch
    })
  }, [tickets, activeTab, searchQuery])

  // Early return após todos os hooks
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isScrolled={true} />
        <main className="flex-1 container mx-auto px-4 py-8 pt-24">
          <div className="max-w-7xl mx-auto text-center py-16">
            <p className="text-gray-600 mb-4">Você precisa estar logado para ver seus ingressos</p>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
            >
              FAZER LOGIN
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const clickedOnTicket = (id: string) => {
    setOpenModalTicket(true)
    setTicketIdClicked(id)
  }

  const handleTransferTicket = (ticketId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Previne que o click do card seja acionado
    // Navegar para página de transferência
    window.location.href = `/transfer-ticket/${ticketId}`
  }

  const handleViewTicket = (ticketId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    clickedOnTicket(ticketId)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        {openModalTicket && tickets && (
          <Subscribed
            onOpenChange={setOpenModalTicket}
            open={openModalTicket}
            qrCode={tickets.find((loopticket) => loopticket._id === ticketIdClicked)?.qrCode || null}
          />
        )}

        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Meus Ingressos</h1>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Buscar por evento, email ou pedido"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:block border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {statusOptions.map((option) => (
                <Tab
                  key={option.value}
                  isActive={activeTab === option.value}
                  onClick={() => setActiveTab(option.value)}
                >
                  {option.label}
                </Tab>
              ))}
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="sm:hidden mb-6">
            <Select value={activeTab} onValueChange={(value: "ativo" | "encerrado") => setActiveTab(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "Nenhum ingresso encontrado com os critérios de busca"
                  : `Não há ingressos ${activeTab === "ativo" ? "ativos" : "encerrados"}`}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
                >
                  ENCONTRAR EVENTOS
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="border rounded-lg hover:shadow-lg transition-all duration-200 bg-white cursor-pointer group"
                  onClick={() => clickedOnTicket(ticket._id)}
                >
                  <div className="flex flex-col p-6">
                    <div className="flex flex-col justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#02488C] transition-colors">
                        {ticket.eventTitle}
                      </h3>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Data:</span>
                        <span className="text-gray-900 text-sm font-medium">
                          {ticket.Event?.startDate && new Date(ticket.Event.startDate).toLocaleDateString("pt-BR")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Local:</span>
                        <span className="text-gray-900 text-sm font-medium">{ticket.Event?.city}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Email:</span>
                        <span className="text-gray-900 text-sm font-medium truncate">{ticket.Owner.email}</span>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                      <Button
                        onClick={(e) => handleViewTicket(ticket._id, e)}
                        variant="outline"
                        className="flex-1 text-[#02488C] border-[#02488C] cursor-pointer hover:bg-[#02488C] hover:text-white transition-colors"
                      >
                        <Eye size={16} className="mr-2" />
                        Visualizar
                      </Button>

                      {ticket.status === "ativo" && (
                        <Button
                          onClick={(e) => handleTransferTicket(ticket._id, e)}
                          variant="outline"
                          className="flex-1 text-[#FEC800] border-[#FEC800] cursor-pointer hover:bg-[#FEC800] hover:text-gray-900 transition-colors"
                        >
                          <ArrowRightLeft size={16} className="mr-2" />
                          Transferir
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}