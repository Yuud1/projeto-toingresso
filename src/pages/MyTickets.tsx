import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TabProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

const Tab = ({ isActive, children, onClick }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative",
        isActive
          ? "text-[#02488C]"
          : "text-gray-500 hover:text-gray-700"
      )}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
      )}
    </button>
  );
};

export default function MyTickets() {
  const [activeTab, setActiveTab] = useState<"ativos" | "pendentes" | "cancelados" | "encerrados">("ativos");
  const [searchQuery, setSearchQuery] = useState("");

  const hasTickets = false; // Temporário, será substituído pela lógica real

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-2xl font-bold">Ingressos</h1>
            <div className="relative w-full md:w-auto md:min-w-[400px]">
              <Input
                type="text"
                placeholder="Buscar pelo nome, email, ingresso ou pedido"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-16"
              />
              <Button 
                className="absolute right-0 top-0 bottom-0 px-4 bg-transparent hover:bg-transparent text-[#02488C]"
                onClick={() => {/* Implementar busca */}}
              >
                BUSCAR
              </Button>
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <Tab
                isActive={activeTab === "ativos"}
                onClick={() => setActiveTab("ativos")}
              >
                Ativos
              </Tab>
              <Tab
                isActive={activeTab === "pendentes"}
                onClick={() => setActiveTab("pendentes")}
              >
                Pendentes
              </Tab>
              <Tab
                isActive={activeTab === "cancelados"}
                onClick={() => setActiveTab("cancelados")}
              >
                Cancelados
              </Tab>
              <Tab
                isActive={activeTab === "encerrados"}
                onClick={() => setActiveTab("encerrados")}
              >
                Encerrados
              </Tab>
            </div>
          </div>

          {!hasTickets ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">Não há ingressos para próximos eventos</p>
              <Button 
                onClick={() => window.location.href = "/events"}
                className="bg-[#02488C] hover:bg-[#02488C]/90"
              >
                ENCONTRAR EVENTOS
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Lista de ingressos será renderizada aqui */}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 