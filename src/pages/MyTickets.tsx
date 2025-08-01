import type React from "react";

import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, ArrowRightLeft, Eye, Calendar, Clock, MapPin, X } from "lucide-react";
import { useUser } from "@/contexts/useContext";
import type UserTicketsInterface from "@/interfaces/UserTicketsInterface";
import Subscribed from "./Subscribed";
import TransferTicket from "./TransferTicket";
import axios from "axios";
import { truncateTextResponsive } from "@/utils/formatUtils";

interface TabProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const Tab = ({ isActive, children, onClick, className }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative cursor-pointer",
        isActive ? "text-[#02488C]" : "text-gray-500 hover:text-gray-700",
        className
      )}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
      )}
    </button>
  );
};

const statusOptions = [
  { value: "ativo", label: "Ativos" },
  { value: "encerrado", label: "Encerrados" },
] as const;

export default function MyTickets() {
  const { user } = useUser();

  // Todos os hooks devem estar no topo, antes de qualquer early return
  const [activeTab, setActiveTab] = useState<"ativo" | "encerrado">("ativo");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<UserTicketsInterface[] | undefined>(
    user?.tickets
  );  
  
  const [openModalTicket, setOpenModalTicket] = useState(false);
  const [openModalTransfer, setOpenModalTransfer] = useState(false);
  const [transferTicketId, setTransferTicketId] = useState<string | undefined>(
    undefined
  );
  const [ticketIdClicked, setTicketIdClicked] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    async function fetchUserTickets() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Buscar dados do usuário com tickets populados
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_USER_DATA}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.userFound && response.data.userFound.tickets) {
          setTickets(response.data.userFound.tickets);
        }
      } catch (error) {
        console.error("Erro ao buscar tickets:", error);
        // Fallback para dados do contexto
        setTickets(user?.tickets);
      }
    }

    fetchUserTickets();
  }, [user]);

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];

    if (activeTab === "ativo") {
      return tickets.filter((ticket) => ticket.used === false);
    } else {
      return tickets.filter((ticket) => ticket.used === true);
    }
  }, [tickets, activeTab, searchQuery]);

  // Early return após todos os hooks
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isScrolled={true} />
        <main className="flex-1 container mx-auto px-4 py-8 pt-24">
          <div className="max-w-7xl mx-auto text-center py-16">
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para ver seus ingressos
            </p>
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
    );
  }

  const clickedOnTicket = (id: string) => {
    setOpenModalTicket(true);
    setTicketIdClicked(id);
  };

  const handleTransferTicket = (ticketId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenModalTransfer(true);
    setTransferTicketId(ticketId);
  };

  const handleViewTicket = (ticketId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    clickedOnTicket(ticketId);
  };

  const handleCancelSubscription = async (ticketId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!confirm("Tem certeza que deseja cancelar sua inscrição neste evento?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        return;
      }

      // Aqui você faria a chamada para a API para cancelar a inscrição
      // Por enquanto, vou apenas mostrar um alerta
      alert("Funcionalidade de cancelamento será implementada em breve!");
      
      // Exemplo de como seria a chamada da API:
      // await axios.delete(
      //   `${import.meta.env.VITE_API_BASE_URL}/api/tickets/${ticketId}`,
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );

      // Atualizar a lista de tickets removendo o ticket cancelado
      // setTickets(prevTickets => prevTickets?.filter(ticket => ticket._id !== ticketId));
      
    } catch (error) {
      console.error("Erro ao cancelar inscrição:", error);
      alert("Erro ao cancelar inscrição. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        {openModalTicket && tickets && (
          <Subscribed
            onOpenChange={setOpenModalTicket}
            open={openModalTicket}
            qrCode={
              tickets.find((loopticket) => loopticket._id === ticketIdClicked)
                ?.qrCode || null
            }
            ticketId={
              tickets.find((loopticket) => loopticket._id === ticketIdClicked)
                ?._id
            }
          />
        )}
        {openModalTransfer && tickets && (
          <TransferTicket
            open={openModalTransfer}
            onOpenChange={setOpenModalTransfer}
            ticketId={transferTicketId}
          ></TransferTicket>
        )}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Meus Ingressos</h1>
            <div className="relative w-full max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
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
            <Select
              value={activeTab}
              onValueChange={(value: "ativo" | "encerrado") =>
                setActiveTab(value)
              }
            >
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
                  ? "Nenhum ingresso encontrado com os critéfrios de busca"
                  : `Não há ingressos ${
                      activeTab === "ativo" ? "ativos" : "encerrados"
                    }`}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
                >
                  Encontrar Eventos
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => {
                const event = ticket.Event;                
                
                
                const startDate = event?.dates[0]?.startDate ? new Date(event.dates[0].startDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                }) : "Data não informada";
                
                const startTime = event?.dates[0]?.startTime ? event.dates[0].startTime.slice(0, 5) : "Hora não informada";

                return (
                  <div
                    key={ticket._id}
                    className="w-full h-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group mb-10"
                    onClick={() => clickedOnTicket(ticket._id)}
                  >
                    {/* Imagem */}
                    <div className="relative" style={{ aspectRatio: '16/9' }}>
                      <img
                        src={event?.image || "/placeholder.svg"}
                        alt={ticket.eventTitle}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.used ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {ticket.used ? "Utilizado" : "Ativo"}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-[#02488C] transition-colors">
                        {truncateTextResponsive(ticket.eventTitle)}
                      </h3>

                      {/* Localização */}
                      <div className="flex items-start gap-2 mb-3">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">
                            {truncateTextResponsive(`${event?.venueName || "Local não informado"} | ${event?.state || ""}`)}
                          </p>
                        </div>
                      </div>

                      {/* Data e Hora */}
                      <div className="flex items-center mb-3 justify-between gap-2">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{startDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{startTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 min-w-0 flex-1">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm truncate">
                            {truncateTextResponsive(`${event?.neighborhood || ""}, ${event?.city || ""}`)}
                          </p>
                        </div>
                      </div>

                      {/* Email do proprietário */}
                      <div className="pt-3 border-t border-gray-100 flex mb-4">
                        <div className="text-xs text-gray-500 flex items-center justify-center">
                          <span className="font-medium text-gray-700">
                            {ticket.Owner.email}
                          </span>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                        <Button
                          onClick={(e) => handleViewTicket(ticket._id, e)}
                          variant="outline"
                          className="flex-1 text-white border-[#02488C] bg-[#02488C] hover:bg-[#02488C]/90 hover:border-[#02488C]/90 hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye size={16} className="mr-2" />
                          Visualizar
                        </Button>

                        {ticket.status === "ativo" && (
                          <Button
                            onClick={(e) => handleTransferTicket(ticket._id, e)}
                            variant="outline"
                            disabled={ticket.used}
                            className={cn(
                              "flex-1 text-white border-[#FEC800] bg-[#FEC800] transition-colors",
                              ticket.used
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-[#e0b400] hover:border-[#e0b400] hover:text-white cursor-pointer"
                            )}
                          >
                            <ArrowRightLeft size={16} className="mr-2" />
                            Transferir
                          </Button>
                        )}

                        {/* Botão de Cancelar Inscrição - apenas para eventos gratuitos */}
                        {event?.isFree && ticket.status === "ativo" && !ticket.used && (
                          <Button
                            onClick={(e) => handleCancelSubscription(ticket._id, e)}
                            variant="outline"
                            className="flex-1 text-white border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors cursor-pointer"
                          >
                            <X size={16} className="mr-2" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
