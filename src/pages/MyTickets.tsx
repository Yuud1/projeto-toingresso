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
import { Search } from "lucide-react";
import { useUser } from "@/contexts/useContext";
import UserTicketsInterface from "@/interfaces/UserTicketsInterface";
import Subscribed from "./Subscribed";

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
  { value: "pendente", label: "Pendentes" },
  { value: "cancelado", label: "Cancelados" },
  { value: "encerrado", label: "Encerrados" },
] as const;

export default function MyTickets() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const [activeTab, setActiveTab] = useState<
    "ativo" | "pendente" | "cancelado" | "encerrado"
  >("ativo");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<UserTicketsInterface[] | undefined>(
    user?.tickets
  );
  const [openModalTicket, setOpenModalTicket] = useState(false);
  const [ticketIdClicked, setTicketIdClicked] = useState<string | undefined>(undefined);
  console.log(ticketIdClicked);
  
  useEffect(() => {
    setTickets(user?.tickets);
  }, [user]);

  const filteredTickets = useMemo(() => {
    return tickets?.filter((ticket) => {
      const matchesTab = ticket.status === activeTab;
      const matchesSearch =
        searchQuery === "" ||
        ticket.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.Owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket._id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const clickedOnTicket = (id: string) => {
    setOpenModalTicket(true);
    setTicketIdClicked(id)
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        {openModalTicket && tickets ? <Subscribed onOpenChange={setOpenModalTicket} open={openModalTicket} qrCode={tickets.find((loopticket) => loopticket._id === ticketIdClicked)?.qrCode || null}></Subscribed>: null}
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Ingressos</h1>
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
              onValueChange={(
                value: "ativo" | "pendente" | "cancelado" | "encerrado"
              ) => setActiveTab(value)}
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

          {filteredTickets?.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">
                Não há ingressos para próximos eventos
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
              >
                ENCONTRAR EVENTOS
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTickets?.map((ticket) => (
                <div
                  key={ticket._id}
                  className="border rounded-lg hover:shadow-md transition-shadow bg-white cursor-pointer"
                  onClick={() => clickedOnTicket(ticket._id)}
                >
                  <div className="flex flex-col p-4">
                    <div className="flex flex-col justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">
                        {ticket.eventTitle}
                      </h3>
                    </div>
                    <div className="flex flex-row w-full gap-1">
                      <p className="text-gray-600 mb-1">Data:</p>
                      {ticket.Event?.startDate &&
                        new Date(
                          ticket.Event.startDate
                        ).toLocaleDateString()}{" "}
                    </div>
                    <div className="flex flex-row w-full gap-1">
                      <p className="text-gray-600 mb-1">Cliente:</p>
                      {ticket.Owner.name}
                    </div>
                    <div className="flex flex-row">
                      <p className="text-gray-600">
                        Email: {ticket.Owner.email}
                      </p>
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
  );
}
