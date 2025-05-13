import { useState, useMemo } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface Ticket {
  id: string;
  eventName: string;
  eventDate: string;
  ticketNumber: string;
  status: "ativos" | "pendentes" | "cancelados" | "encerrados";
  customerName: string;
  customerEmail: string;
  orderNumber: string;
}

interface TabProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className?: string; // ✅ adiciona aqui
}

const Tab = ({ isActive, children, onClick, className }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative cursor-pointer",
        isActive
          ? "text-[#02488C]"
          : "text-gray-500 hover:text-gray-700",
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

// Dados de exemplo para teste
const mockTickets: Ticket[] = [
  {
    id: "1",
    eventName: "Show de Rock",
    eventDate: "2024-04-15",
    ticketNumber: "TICKET-001",
    status: "ativos",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    orderNumber: "ORDER-001"
  },
  {
    id: "2",
    eventName: "Festival de Música",
    eventDate: "2024-05-20",
    ticketNumber: "TICKET-002",
    status: "pendentes",
    customerName: "Maria Santos",
    customerEmail: "maria@email.com",
    orderNumber: "ORDER-002"
  },
  {
    id: "3",
    eventName: "Teatro",
    eventDate: "2024-03-10",
    ticketNumber: "TICKET-003",
    status: "cancelados",
    customerName: "Pedro Oliveira",
    customerEmail: "pedro@email.com",
    orderNumber: "ORDER-003"
  }
];

export default function MyTickets() {
  const [activeTab, setActiveTab] = useState<"ativos" | "pendentes" | "cancelados" | "encerrados">("ativos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTickets = useMemo(() => {
    return mockTickets.filter(ticket => {
      const matchesTab = ticket.status === activeTab;
      const matchesSearch = searchQuery === "" || 
        ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Ingressos</h1>
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

          <div className="border-b border-gray-200 mb-6">
          <div className="overflow-x-auto">
  <div className="flex space-x-4 sm:space-x-8 min-w-max">
    <Tab
      isActive={activeTab === "ativos"}
      onClick={() => setActiveTab("ativos")}
      className="whitespace-nowrap"
    >
      Ativos
    </Tab>
    <Tab
      isActive={activeTab === "pendentes"}
      onClick={() => setActiveTab("pendentes")}
      className="whitespace-nowrap"
    >
      Pendentes
    </Tab>
    <Tab
      isActive={activeTab === "cancelados"}
      onClick={() => setActiveTab("cancelados")}
      className="whitespace-nowrap"
    >
      Cancelados
    </Tab>
    <Tab
      isActive={activeTab === "encerrados"}
      onClick={() => setActiveTab("encerrados")}
      className="whitespace-nowrap"
    >
      Encerrados
    </Tab>
</div>

            </div>
          </div>


          {filteredTickets.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">Não há ingressos para próximos eventos</p>
              <Button 
                onClick={() => window.location.href = "/"}
                className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
              >
                ENCONTRAR EVENTOS
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg hover:shadow-md transition-shadow bg-white cursor-pointer">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{ticket.eventName}</h3>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Ingresso #{ticket.ticketNumber}</p>
                        <p className="text-sm text-gray-500">Pedido #{ticket.orderNumber}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-1">Data: {new Date(ticket.eventDate).toLocaleDateString()}</p>
                    <p className="text-gray-600 mb-1">Cliente: {ticket.customerName}</p>
                    <p className="text-gray-600">Email: {ticket.customerEmail}</p>
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