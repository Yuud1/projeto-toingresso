import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardImage,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  Eye,
  Search,
  Users,
  Calendar,
  Ticket,
  TrendingUp,
  Copy,
  ChevronDown,
  Home,
  BarChart3,
  EyeOff,
  Receipt,
  Award,
  Maximize2,
  Minimize2,
  UserCheck,
  ScanEye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import axios from "axios";
import type EventInterface from "@/interfaces/EventInterface";
import { useUser } from "@/contexts/useContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteModal from "@/components/DeleteModal";
import GenericModal from "@/components/GenericModal";
import { EditEventModal } from "@/components/EditEventModal";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import CertificateTutorial from "./CertificateTutorial";
import CertificateGenerator from "./CertificateGenerator";
import EventScanner from "./EventScanner";

interface TabProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export interface CheckoutData {
  id: string;
  customerName: string;
  customerEmail: string;
  eventName: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  purchaseDate: string;
  status: "completed" | "pending" | "failed";
}

interface CertificateAssociation {
  eventId: string;
  courseName: string;
  totalHours: number;
  instructorName: string;
  institution: string;
  courseDescription: string;
  template: string;
}

export interface EventParticipant {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  checkInDate?: string;
}

const Tab = ({ isActive, children, onClick, className }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative",
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

const mainTabOptions = [
  { value: "inicio", label: "Início", icon: Home },
  { value: "dashboard", label: "Dashboard", icon: BarChart3 },
  { value: "scan", label: "Scan", icon: ScanEye },
  { value: "certificados", label: "Certificados", icon: Award },
] as const;

const subTabOptions = [
  { value: "active", label: "Ativos" },
  { value: "finished", label: "Encerrados" },
] as const;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const mockCheckouts: CheckoutData[] = [
  {
    id: "1",
    customerName: "João Silva",
    customerEmail: "joao@email.com",
    eventName: "Workshop React",
    ticketType: "VIP",
    quantity: 2,
    totalAmount: 150.0,
    purchaseDate: "2024-01-15T10:30:00Z",
    status: "completed",
  },
  // ... (outros mockCheckouts)
];

export default function MyEvents() {
  const token = localStorage.getItem("token");
  const { user } = useUser();
  const { toast } = useToast();

  const [events, setEvents] = useState<EventInterface[]>([]);
  const [mainTab, setMainTab] = useState<
    "inicio" | "dashboard" | "certificados" | "scan"
  >("inicio");
  const [subTab, setSubTab] = useState<"active" | "finished">("active");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToStop, setEventToStop] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventInterface | null>(
    null
  );
  const [ticketToken, setTicketToken] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // Estados para funcionalidades do dashboard
  const [hideValues, setHideValues] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCheckoutMaximized, setIsCheckoutMaximized] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateAssociation, setCertificateAssociation] =
    useState<CertificateAssociation>({
      eventId: "",
      courseName: "",
      totalHours: 0,
      instructorName: "",
      institution: "",
      courseDescription: "",
      template: "modern",
    });
  const [checkouts] = useState<CheckoutData[]>(mockCheckouts);

  // Estados para aba de certificados
  const [showCertificateTutorial, setShowCertificateTutorial] = useState(true);

  // Novo estado para seleção de evento no dashboard
  const [selectedDashboardEvent, setSelectedDashboardEvent] = useState<
    string | undefined
  >(undefined);

  // TODA A LÓGICA DO SCANNER FOI MOVIDA PARA O COMPONENTE EventScanner.tsx

  const handleCopy = (text: string) => {
    copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFilteredEventsForDashboard = () => {
    if (selectedDashboardEvent) {
      return events;
    }
    return events.filter((event) => event._id === selectedDashboardEvent);
  };

  const revenueData = months.map((month, idx) => {
    const filteredEvents = getFilteredEventsForDashboard();
    const monthRevenue = filteredEvents
      .filter((e) => new Date(e.startDate).getMonth() === idx)
      .reduce((acc, event) => {
        const eventRevenue = event.tickets.reduce(
          (ticketAcc, ticket) => ticketAcc + ticket.price * ticket.soldQuantity,
          0
        );
        return acc + eventRevenue;
      }, 0);

    return { name: month, revenue: monthRevenue };
  });

  useEffect(() => {
    async function getEvents() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_GET_USER_EVENTS
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Response", response);

        if (response.data.events) {
          setEvents([...response.data.events]);
        }
      } catch (error: any) {
        if (error.response?.data?.logged === false) {
          window.location.href = "/login";
        }
      }
    }

    getEvents();
  }, [user, token]);

  const filteredEvents = events.filter((event) => {
    const matchesTab =
      subTab === "active"
        ? event.status === "active" || event.status === "editing"
        : event.status === "finished";
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const dashboardMetrics = (() => {
    const filteredEvents = getFilteredEventsForDashboard();
    return {
      totalEvents: filteredEvents.length,
      activeEvents: filteredEvents.filter((e) => e.status === "active").length,
      totalRevenue: filteredEvents.reduce((acc, event) => {
        const eventRevenue = event.tickets.reduce(
          (ticketAcc, ticket) => ticketAcc + ticket.price * ticket.soldQuantity,
          0
        );
        return acc + eventRevenue;
      }, 0),
      totalTicketsSold: filteredEvents.reduce((acc, event) => {
        const eventTicketsSold = event.tickets.reduce(
          (ticketAcc, ticket) => ticketAcc + ticket.soldQuantity,
          0
        );
        return acc + eventTicketsSold;
      }, 0),
      upcomingEvents: filteredEvents.filter(
        (e) => new Date(e.startDate) > new Date() && e.status === "active"
      ).length,
    };
  })();

  const handleEdit = (eventId: string) => {
    const event = events.find((e) => e._id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsEditModalOpen(true);
    }
  };

  const handleStopEvent = async (eventId: string) => {
    setEventToStop(eventId);
    setIsStopModalOpen(true);
  };

  const confirmStopEvent = async () => {
    if (eventToStop) {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_FINISH_EVENT
          }`,
          { eventToStop },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.stopped) {
          const updatedEvents = events.map((event) =>
            event._id === eventToStop
              ? { ...event, status: "finished" as const }
              : event
          );

          setEvents(updatedEvents);
          setEventToStop(null);
          setIsStopModalOpen(false);
          setSubTab("finished");

          toast({
            title: "Evento encerrado com sucesso!",
            description:
              "O evento foi movido para a lista de eventos encerrados.",
          });
        }
      } catch (error) {
        console.error("Erro ao encerrar evento:", error);
        toast({
          title: "Erro ao encerrar evento",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveEvent = (updatedEvent: EventInterface) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
    setIsEditModalOpen(false);
  };

  const handleDelete = async (eventId: string) => {
    try {
      setEventToDelete(eventId);
      setIsDeleteModalOpen(true);
    } catch (error) {
      console.log("Erro", error);
    }
  };

  const confirmDelete = async () => {
    try {
      if (eventToDelete) {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_EVENT_DELETE
          }`,
          {
            data: { id: eventToDelete },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.deleted) {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event._id !== eventToDelete)
          );
          setEventToDelete(null);
          setIsDeleteModalOpen(false);
        }
      }
    } catch (error: any) {
      console.log("Erorr", error);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleView = (eventId: string) => {
    const event = events.find((e) => e._id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsViewModalOpen(true);
    }
  };

  const getCurrentSubTabLabel = () => {
    return (
      subTabOptions.find((option) => option.value === subTab)?.label || "Ativos"
    );
  };

  const getCurrentMainTabLabel = () => {
    return (
      mainTabOptions.find((option) => option.value === mainTab)?.label ||
      "Início"
    );
  };

  const getCurrentMainTabIcon = () => {
    const TabIcon =
      mainTabOptions.find((option) => option.value === mainTab)?.icon || Home;
    return <TabIcon className="h-4 w-4 mr-2" />;
  };

  const handleGenerateActivationTicketsToken = async (eventId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_GENERATE_TICKET_TOKEN
        }`,
        { eventId }
      );
      console.log(response);

      if (response.data.generated) {
        setTicketToken(response.data.token);
      }
    } catch (error) {
      console.log("Erro ao gerar token", error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "O token foi copiado para a área de transferência.",
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o token.",
        variant: "destructive",
      });
      console.error("Falha ao copiar texto: ", err);
    }
  };

  const formatCurrency = (value: number) => {
    if (hideValues) return "R$ ***";
    return `R$ ${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatNumber = (value: number) => {
    if (hideValues) return "***";
    return value.toString();
  };

  const handleSaveCertificateAssociation = async () => {
    try {
      console.log("Salvando associação:", certificateAssociation);

      toast({
        title: "Associação salva com sucesso!",
        description: "O evento foi associado ao certificado.",
      });

      setIsCertificateModalOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro ao salvar associação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Concluído", variant: "default" as const },
      pending: { label: "Pendente", variant: "secondary" as const },
      failed: { label: "Falhou", variant: "destructive" as const },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24 max-w-full overflow-x-hidden">
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Excluir Evento"
          description="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
          errorMessage={errorMessage}
        />

        <DeleteModal
          isOpen={isStopModalOpen}
          onClose={() => setIsStopModalOpen(false)}
          onConfirm={confirmStopEvent}
          title="Encerrar Evento"
          description="Tem certeza que deseja encerrar este evento? O evento será movido para a lista de eventos finalizados e não poderá mais receber novos participantes."
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
                  {new Date(selectedEvent.startDate).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Local</h4>
                <p className="text-sm text-gray-600">
                  {selectedEvent.neighborhood}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Descrição</h4>
                <p className="text-sm text-gray-600">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-medium">
                  Gerar token de ativação de tickets
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="token"
                      defaultValue={
                        selectedEvent.ticketActivationToken || ticketToken
                      }
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      onClick={() =>
                        handleCopy(
                          selectedEvent.ticketActivationToken ||
                            ticketToken ||
                            ""
                        )
                      }
                      variant="outline"
                      disabled={
                        !selectedEvent.ticketActivationToken && !ticketToken
                      }
                      className="cursor-pointer"
                    >
                      {copied ? "Copiado!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    onClick={() =>
                      handleGenerateActivationTicketsToken(selectedEvent._id)
                    }
                    className="w-full sm:w-1/2 md:w-1/4 cursor-pointer"
                  >
                    Gerar Token
                  </Button>
                </div>
              </div>

              {selectedEvent.status !== "editing" &&
                selectedEvent.tickets.map((ticket, index) => {
                  return (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">
                          Ingressos Vendidos
                        </h4>
                        <p className="text-sm text-gray-600">
                          {ticket.soldQuantity} / {ticket.quantity}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">Receita</h4>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(ticket.soldQuantity * ticket.price)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </GenericModal>

        <GenericModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          title="Últimos Checkouts"
          showFooter={false}
          className={
            isCheckoutMaximized ? "max-w-[90vw] max-h-[90vh]" : "max-w-2xl"
          }
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {checkouts.length} checkouts encontrados
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCheckoutMaximized(!isCheckoutMaximized)}
              >
                {isCheckoutMaximized ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div
              className={cn(
                "space-y-3 overflow-y-auto",
                isCheckoutMaximized ? "max-h-[70vh]" : "max-h-96"
              )}
            >
              {!isCheckoutMaximized ? (
                <div className="space-y-2">
                  {checkouts.map((checkout) => (
                    <div key={checkout.id} className="p-3 border rounded-lg">
                      <p className="font-medium">{checkout.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {checkout.eventName}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {checkouts.map((checkout) => (
                    <Card key={checkout.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">
                            {checkout.customerName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {checkout.customerEmail}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm font-medium">
                            {checkout.eventName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {checkout.ticketType}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(checkout.purchaseDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div className="text-right md:text-left">
                            <p className="text-sm font-medium">
                              {checkout.quantity}x -{" "}
                              {formatCurrency(checkout.totalAmount)}
                            </p>
                          </div>
                          <div className="flex justify-end md:justify-start">
                            {getStatusBadge(checkout.status)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </GenericModal>

        <GenericModal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          title="Associar Certificado ao Evento"
          showFooter={true}
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="courseName">Nome do Curso</Label>
              <Input
                id="courseName"
                value={certificateAssociation.courseName}
                onChange={(e) =>
                  setCertificateAssociation({
                    ...certificateAssociation,
                    courseName: e.target.value,
                  })
                }
                placeholder="Nome do curso para o certificado"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalHours">Carga Horária</Label>
                <Input
                  id="totalHours"
                  type="number"
                  value={certificateAssociation.totalHours}
                  onChange={(e) =>
                    setCertificateAssociation({
                      ...certificateAssociation,
                      totalHours: Number(e.target.value),
                    })
                  }
                  placeholder="40"
                />
              </div>
              <div>
                <Label htmlFor="template">Template</Label>
                <Select
                  value={certificateAssociation.template}
                  onValueChange={(value) =>
                    setCertificateAssociation({
                      ...certificateAssociation,
                      template: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Moderno</SelectItem>
                    <SelectItem value="classic">Clássico</SelectItem>
                    <SelectItem value="minimal">Minimalista</SelectItem>
                    <SelectItem value="elegant">Elegante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instructorName">Instrutor</Label>
                <Input
                  id="instructorName"
                  value={certificateAssociation.instructorName}
                  onChange={(e) =>
                    setCertificateAssociation({
                      ...certificateAssociation,
                      instructorName: e.target.value,
                    })
                  }
                  placeholder="Nome do instrutor"
                />
              </div>
              <div>
                <Label htmlFor="institution">Instituição</Label>
                <Input
                  id="institution"
                  value={certificateAssociation.institution}
                  onChange={(e) =>
                    setCertificateAssociation({
                      ...certificateAssociation,
                      institution: e.target.value,
                    })
                  }
                  placeholder="Nome da instituição"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="courseDescription">Descrição do Curso</Label>
              <Textarea
                id="courseDescription"
                value={certificateAssociation.courseDescription}
                onChange={(e) =>
                  setCertificateAssociation({
                    ...certificateAssociation,
                    courseDescription: e.target.value,
                  })
                }
                placeholder="Descrição do conteúdo do curso..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCertificateModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveCertificateAssociation}>
                Salvar Associação
              </Button>
            </div>
          </div>
        </GenericModal>

        <EditEventModal
          event={selectedEvent}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEvent}
        />

        <div className="max-w-7xl mx-auto mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">Meus Eventos</h1>
            <div className="hidden lg:flex space-x-4">
              {mainTabOptions.map((option) => (
                <Tab
                  key={option.value}
                  isActive={mainTab === option.value}
                  onClick={() => {
                    if (option.value === "certificados")
                      setShowCertificateTutorial(true);
                    setMainTab(
                      option.value as
                        | "inicio"
                        | "dashboard"
                        | "certificados"
                        | "scan"
                    );
                  }}
                  className="text-base cursor-pointer"
                >
                  <div className="flex items-center">
                    <option.icon className="h-4 w-4 mr-2" />
                    {option.label}
                  </div>
                </Tab>
              ))}
            </div>

            <div className="lg:hidden w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 w-full sm:w-auto"
                  >
                    {getCurrentMainTabIcon()}
                    {getCurrentMainTabLabel()}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {mainTabOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      className={cn(
                        "cursor-pointer",
                        mainTab === option.value && "bg-muted"
                      )}
                      onClick={() => {
                        if (option.value === "certificados")
                          setShowCertificateTutorial(true);
                        setMainTab(
                          option.value as
                            | "inicio"
                            | "dashboard"
                            | "certificados"
                            | "scan"
                        );
                      }}
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

          {mainTab === "scan" && <EventScanner />}

          {mainTab === "inicio" && (
            <>
              <div className="flex flex-col gap-4 mb-6">
                <div className="md:hidden w-full mt-4">
                  <Select
                    value={subTab}
                    onValueChange={(value) =>
                      setSubTab(value as "active" | "finished")
                    }
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

                <div className="hidden md:flex space-x-6">
                  {subTabOptions.map((option) => (
                    <Tab
                      key={option.value}
                      isActive={subTab === option.value}
                      onClick={() =>
                        setSubTab(option.value as "active" | "finished")
                      }
                      className="cursor-pointer"
                    >
                      {option.label}
                    </Tab>
                  ))}
                </div>

                <div className="relative w-full">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
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
                  <p className="text-gray-600 mb-4">
                    Não há eventos {getCurrentSubTabLabel().toLowerCase()}
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/criar-evento")}
                    className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
                  >
                    Criar Evento
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredEvents.map((event) => (
                    <Card
                      key={event._id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="line-clamp-1 text-sm sm:text-base">
                          {event.title}
                        </CardTitle>
                        <CardImage className="w-full h-32 sm:h-48 object-cover rounded-md">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </CardImage>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-1">
                          {event.neighborhood}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex gap-2">
                            {event.status !== "finished" && (
                              <Button
                                variant="outline"
                                onClick={() => handleStopEvent(event._id)}
                                className="cursor-pointer flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white hover:text-white text-xs sm:text-sm px-2 py-1"
                                title="Encerrar evento"
                              >
                                <span>Finalizar</span>
                              </Button>
                            )}
                          </div>
                          <div className="flex gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleView(event._id)}
                              className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10"
                              title="Visualizar evento"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            {event.status !== "finished" && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEdit(event._id)}
                                className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10"
                                title="Editar evento"
                              >
                                <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDelete(event._id)}
                              className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10"
                              title="Excluir evento"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
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
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHideValues(!hideValues)}
                    className="flex-1 sm:flex-none"
                  >
                    <EyeOff className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">
                      {hideValues ? "Mostrar" : "Ocultar"} Valores
                    </span>
                  </Button>
                </div>

                <div className="w-full lg:w-auto lg:min-w-[250px]">
                  <Select
                    value={selectedDashboardEvent}
                    onValueChange={setSelectedDashboardEvent}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecionar evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os eventos</SelectItem>
                      {events.map((event) => (
                        <SelectItem key={event._id} value={event._id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Eventos
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(dashboardMetrics.totalEvents)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(dashboardMetrics.activeEvents)} eventos
                      ativos
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Ingressos Vendidos
                    </CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(dashboardMetrics.totalTicketsSold)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedDashboardEvent
                        ? "Em todos os eventos"
                        : "Neste evento"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Receita Total
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(dashboardMetrics.totalRevenue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedDashboardEvent 
                        ? "Em todos os eventos"
                        : "Neste evento"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Próximos Eventos
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(dashboardMetrics.upcomingEvents)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Eventos futuros
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {selectedDashboardEvent ? (
                  <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      navigate(`/event-arrivals/${selectedDashboardEvent}`)
                    }
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Últimos Checkouts
                      </CardTitle>
                      <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatNumber(checkouts.length)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Clique para ver chegadas em tempo real
                      </p>
                    </CardContent>
                  </Card>
                ) : null}

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Certificados Gerados
                    </CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(42)}</div>
                    <p className="text-xs text-muted-foreground">
                      Total de certificados
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Participantes Únicos
                    </CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumber(156)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Pessoas diferentes
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                      Receita por mês{" "}
                      {selectedDashboardEvent &&
                        `- ${
                          events.find((e) => e._id === selectedDashboardEvent)
                            ?.title
                        }`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[240px] sm:h-[300px] lg:h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData} style={{ fontSize: 12 }}>
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            dy={8}
                            fontSize={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={60}
                            fontSize={10}
                            tickFormatter={(v) =>
                              hideValues ? "***" : `R$${v}`
                            }
                          />
                          <Bar
                            dataKey="revenue"
                            fill="#222"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {mainTab === "certificados" && (
            <div className="space-y-6">
              {showCertificateTutorial ? (
                <CertificateTutorial
                  onProceed={() => setShowCertificateTutorial(false)}
                />
              ) : (
                <CertificateGenerator events={events} />
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
