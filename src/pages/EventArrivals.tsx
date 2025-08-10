"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Settings,
  Eye,
  LogOut,
  UserCheck,
  Grid,
  Users,
  Sparkles,
  List,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import ArrivalInterface from "@/interfaces/ArrivalsInterface";
import EventInterface from "@/interfaces/EventInterface";
import UserInterface from "@/interfaces/UserInterface";

// Adicione após as importações
const previewUpdateAnimation = `
  @keyframes previewUpdate {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
  .preview-update {
    animation: previewUpdate 0.3s ease;
  }
`;



// Novas interfaces para resolver problemas de any
interface ParticipantData {
  user?: UserInterface;
  fields?: Record<string, string>;
  arrivedAt?: string;
  subscribedAt?: string;
}

interface ApiResponse {
  participants?: ParticipantData[];
}

interface SocketUserData {
  user?: UserInterface
  fields?: Record<string, string>;
  arrivedAt?: string;
  subscribedAt?: string;
}

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`);

export default function EventArrivalsPage() {
  const { id } = useParams();

  // Estados principais
  const [arrivals, setArrivals] = useState<ArrivalInterface[]>([]);
  const [eventData, setEventData] = useState<EventInterface>();
  const [loading, setLoading] = useState(true);    
  
  // Estados de configuração
  const [isConfigMode, setIsConfigMode] = useState(true);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [showArrivalTime, setShowArrivalTime] = useState(true);
  const [cardStyle, setCardStyle] = useState<"grid" | "list">("grid");
  const [previewMode, setPreviewMode] = useState(false);
  const [commonParameter, setCommonParameter] = useState<string>("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Estados de filtro e busca
  const [searchTerm, setSearchTerm] = useState("");
  const [isLive, setIsLive] = useState(false);

  // Dados filtrados
  const filteredArrivals = arrivals.filter((arrival) => {
    const name = arrival.fields?.name || arrival.user?.name || "";
    const email = arrival.user?.email || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Função para buscar dados do evento
  useEffect(() => {
    async function getEventById() {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_EVENT_GET_SECURE
          }/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (data.event) {
          setEventData(data.event);
        }
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getEventById();
    }
  }, [id]);

  // Função para buscar chegadas
  useEffect(() => {
    async function getArrivalsByEventId() {
      if (!eventData) return;

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${baseUrl}${
            import.meta.env.VITE_GET_ARRIVALS_PARTICIPANTS
          }/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const data: ApiResponse = response.data;

        if (data.participants) {
          // Normalizar os dados para o formato esperado
          // A API pode retornar participantes com ou sem campos personalizados
          // - Com fields: { user: {...}, fields: {...}, arrivedAt: "..." }
          // - Sem fields: { user: {...}, arrivedAt: "..." }
          const normalizedArrivals = data.participants.map((participant: ParticipantData) => ({
            userId: participant.user?._id,
            user: participant.user,
            fields: participant.fields || {}, // Se não tiver fields, usar objeto vazio
            subscribedAt: participant.arrivedAt || participant.subscribedAt || new Date().toISOString(),
            arrivalTime: participant.arrivedAt || participant.subscribedAt || new Date().toISOString(),          
          }));
          
          setArrivals(normalizedArrivals);
        }
      } catch (error) {
        console.error("Erro ao buscar chegadas:", error);
      }
    }

    getArrivalsByEventId();
  }, [eventData, id]);

  // Socket para tempo real
  useEffect(() => {
    if (!isConfigMode && isLive) {
      socket.emit("registerChekcout", id);
      
      socket.on("new_user_checked_in", (userData: SocketUserData) => {                
        
        try {
          // Normalizar os dados recebidos do socket da mesma forma que a API
          const normalizedUserData: ArrivalInterface = {          
            userId: userData.user?._id,
            user: userData.user,
            fields: userData.fields || {}, // Se não tiver fields, usar objeto vazio
            subscribedAt: userData.arrivedAt || userData.subscribedAt || new Date().toISOString(),
            arrivalTime: userData.arrivedAt || userData.subscribedAt || new Date().toISOString(),
          };
          
          
          setArrivals((prev) => [normalizedUserData, ...prev]);
        } catch (error) {
          console.error("Erro ao processar dados do socket:", error);
          console.error("Dados que causaram erro:", userData);
        }
      });
      
      // Adicionar listener para erros do socket
      socket.on("connect_error", (error) => {
        console.error("Erro de conexão do socket:", error);
      });
    }

    return () => {
      socket.off("new_user_checked_in");
      socket.off("connect_error");
    };
  }, [isConfigMode, isLive, id]);

  const toggleField = (fieldName: string) => {
    setSelectedFields((prev) => {
      const newSelection = prev.includes(fieldName)
        ? prev.filter((f) => f !== fieldName)
        : [...prev, fieldName];

      // Forçar atualização da preview quando campos são alterados
      if (previewMode) {
        // Pequeno delay para dar feedback visual
        setTimeout(() => {
          const previewElement = document.querySelector(".preview-card");
          if (previewElement) {
            previewElement.classList.add("preview-update");
            setTimeout(() => {
              previewElement.classList.remove("preview-update");
            }, 300);
          }
        }, 100);
      }

      return newSelection;
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // Função para exportar dados em CSV
  const exportToCSV = () => {
    if (filteredArrivals.length === 0) {
      alert("Não há dados para exportar");
      return;
    }

    // Cabeçalhos do CSV
    const headers = [
      "Nome",
      "Email",
      ...selectedFields,
      ...(commonParameter ? ["Parâmetro"] : []),
      ...(showArrivalTime ? ["Horário de Chegada"] : []),
      "Data de Inscrição",
    ];

    // Dados dos participantes
    const csvData = filteredArrivals.map((arrival) => {
      const row = [
        arrival.fields?.name || arrival.user?.name || "Sem nome",
        arrival.user?.email || "Sem email",
        ...selectedFields.map((field) => arrival.fields?.[field] || "Não informado"),
        ...(commonParameter ? [commonParameter] : []),
        ...(showArrivalTime ? [formatTime(arrival.arrivalTime)] : []),
        formatDate(arrival.subscribedAt),
      ];
      return row;
    });

    // Criar conteúdo CSV
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download do arquivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `participantes_${eventData?.title?.replace(/[^a-zA-Z0-9]/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para exportar dados em Excel (formato XLSX simulado)
  const exportToExcel = () => {
    if (filteredArrivals.length === 0) {
      alert("Não há dados para exportar");
      return;
    }

    // Cabeçalhos
    const headers = [
      "Nome",
      "Email",
      ...selectedFields,
      ...(commonParameter ? ["Parâmetro"] : []),
      ...(showArrivalTime ? ["Horário de Chegada"] : []),
      "Data de Inscrição",
    ];

    // Criar HTML da tabela para Excel
    let tableHTML = `
      <table border="1">
        <thead>
          <tr style="background-color: #f0f0f0; font-weight: bold;">
            ${headers.map((header) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
    `;

    filteredArrivals.forEach((arrival) => {
      tableHTML += `
        <tr>
          <td>${arrival.fields?.name || arrival.user?.name || "Sem nome"}</td>
          <td>${arrival.user?.email || "Sem email"}</td>
          ${selectedFields
            .map((field) => `<td>${arrival.fields?.[field] || "Não informado"}</td>`)
            .join("")}
          ${commonParameter ? `<td>${commonParameter}</td>` : ""}
          ${
            showArrivalTime ? `<td>${formatTime(arrival.arrivalTime)}</td>` : ""
          }
          <td>${formatDate(arrival.subscribedAt)}</td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    // Download do arquivo Excel
    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `participantes_${eventData?.title?.replace(/[^a-zA-Z0-9]/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.xls`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".relative")) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showExportMenu]);

  // Adicione antes do return
  useEffect(() => {
    // Adicionar o estilo de animação ao documento
    const styleElement = document.createElement("style");
    styleElement.innerHTML = previewUpdateAnimation;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Carregando evento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header aprimorado */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-20 shadow-sm ">
        <div className="max-w-7xl mx-auto px-6 py-4 flex sm:flex-row flex-col">
          <div className="sm:flex sm:flex-row flex flex-col sm:items-start justify-between gap-5">
            <div className="flex justify-between gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                {isLive && !isConfigMode && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {eventData?.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(eventData?.dates[0].startDate || "")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {eventData?.city}, {eventData?.state}
                    </span>
                  </div>
                  {isLive && !isConfigMode && (
                    <Badge variant="destructive" className="animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full mr-1" />
                      AO VIVO
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="gap-2"
              >
                <LogOut size={16} />
                Sair
              </Button>

              <Button
                onClick={() => {
                  setIsConfigMode(!isConfigMode);
                  if (isConfigMode) {
                    setIsLive(true);
                  }
                }}
                className={`gap-2 ${
                  isConfigMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Settings size={16} />
                {isConfigMode ? "Iniciar Monitoramento" : "Configurar"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isConfigMode ? (
          <Tabs defaultValue="display" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="display">Visualização</TabsTrigger>
                <TabsTrigger value="fields">Campos</TabsTrigger>
              </TabsList>

              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="gap-2"
              >
                <Eye size={16} />
                {previewMode ? "Ocultar" : "Mostrar"} Preview
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <TabsContent value="display" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Grid className="h-5 w-5 text-blue-600" />
                        Estilo de Visualização
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          variant={cardStyle === "grid" ? "default" : "outline"}
                          onClick={() => setCardStyle("grid")}
                          className="h-20 flex-col gap-2"
                        >
                          <Grid className="h-6 w-6" />
                          <span>Grid</span>
                        </Button>
                        <Button
                          variant={cardStyle === "list" ? "default" : "outline"}
                          onClick={() => setCardStyle("list")}
                          className="h-20 flex-col gap-2"
                        >
                          <List className="h-6 w-6" />
                          <span>Lista</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Configurações de Tempo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            Mostrar horário de chegada
                          </p>
                          <p className="text-sm text-slate-500">
                            Exibe quando cada participante chegou
                          </p>
                        </div>
                        <Switch
                          checked={showArrivalTime}
                          onCheckedChange={setShowArrivalTime}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        Parâmetro Personalizado
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="Ex: VIP, Palestrante, Organizador..."
                        value={commonParameter}
                        onChange={(e) => setCommonParameter(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-sm text-slate-500 mt-2">
                        Este texto aparecerá em todos os cards dos participantes
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fields" className="space-y-6 mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-blue-600" />
                        Campos Personalizados
                      </CardTitle>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-500">
                          {selectedFields.length} de{" "}
                          {eventData?.customFields.length || 0} campos
                          selecionados
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (
                              selectedFields.length ===
                              eventData?.customFields.length
                            ) {
                              setSelectedFields([]);
                            } else {
                              setSelectedFields(
                                eventData?.customFields.map((f) => f.label) ||
                                  []
                              );
                            }
                          }}
                        >
                          {selectedFields.length ===
                          eventData?.customFields.length
                            ? "Desmarcar todos"
                            : "Selecionar todos"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {eventData?.customFields.length === 0 ? (
                          <div className="text-center p-6 text-slate-500">
                            Nenhum campo personalizado definido para este evento
                          </div>
                        ) : (
                          eventData?.customFields.map((field) => (
                            <div
                              key={field._id}
                              className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                                selectedFields.includes(field.label)
                                  ? "border-blue-300 bg-blue-50"
                                  : "hover:bg-slate-50"
                              }`}
                            >
                              <div>
                                <p className="font-medium">{field.label}</p>
                                <p className="text-sm text-slate-500">
                                  Tipo: {field.type}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {selectedFields.includes(field.label) && (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-100 text-blue-800 border-blue-200"
                                  >
                                    Visível
                                  </Badge>
                                )}
                                <Switch
                                  checked={selectedFields.includes(field.label)}
                                  onCheckedChange={() =>
                                    toggleField(field.label)
                                  }
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              {/* Preview aprimorado */}
              {previewMode && (
                <div className="lg:col-span-1">
                  <Card className="sticky top-24 preview-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6">
                        {cardStyle === "grid" ? (
                          <div className="text-center">
                            <Avatar className="w-16 h-16 mx-auto mb-4">
                              <AvatarFallback className="bg-blue-600 text-white text-lg font-bold">
                                AS
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-bold text-lg mb-3">
                              Ana Silva
                            </h3>
                            <div className="space-y-2">
                              <Badge variant="secondary">ana@email.com</Badge>

                              {/* Campos personalizados selecionados */}
                              {eventData?.customFields
                                .filter((field) =>
                                  selectedFields.includes(field.label)
                                )
                                .map((field) => (
                                  <div
                                    key={field._id}
                                    className="text-sm text-slate-600 bg-slate-50 rounded-lg p-2"
                                  >
                                    <span className="font-medium">
                                      {field.label}:
                                    </span>{" "}
                                    {field.type === "email"
                                      ? "exemplo@email.com"                                      
                                      : field.type === "number"
                                      ? "123"
                                      : "Valor de exemplo"}
                                  </div>
                                ))}

                              {commonParameter && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                  {commonParameter}
                                </Badge>
                              )}
                            </div>
                            {showArrivalTime && (
                              <p className="text-sm text-slate-500 mt-4">
                                Chegou às 10:15
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-blue-600 text-white font-bold">
                                AS
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-bold">Ana Silva</h3>
                              <p className="text-sm text-slate-500">
                                ana@email.com
                              </p>

                              {/* Primeiro campo personalizado selecionado (para o modo lista) */}
                              {eventData?.customFields
                                .filter((field) =>
                                  selectedFields.includes(field.label)
                                )
                                .slice(0, 1)
                                .map((field) => (
                                  <p
                                    key={field._id}
                                    className="text-sm text-slate-500"
                                  >
                                    <span className="font-medium">
                                      {field.label}:
                                    </span>{" "}
                                    {field.type === "email"
                                      ? "exemplo@email.com"                                      
                                      : field.type === "number"
                                      ? "123"
                                      : "Valor de exemplo"}
                                  </p>
                                ))}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {showArrivalTime && (
                                <p className="text-sm text-slate-500">10:15</p>
                              )}
                              {commonParameter && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                  {commonParameter}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </Tabs>
        ) : (
          <>
            {/* Dashboard de monitoramento */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total Presentes</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {arrivals.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p className="text-lg font-semibold text-green-600">
                        {isLive ? "Ao Vivo" : "Pausado"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Última Chegada</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {arrivals.length > 0
                          ? formatTime(arrivals[0].arrivalTime)
                          : "--:--"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Evento</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {eventData?.isFree ? "Gratuito" : "Pago"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar participantes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Tempo real:</span>
                  <Switch checked={isLive} onCheckedChange={setIsLive} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                  >
                    <Download className="h-4 w-4" />
                    Exportar
                  </Button>

                  {showExportMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                      <div className="p-2">
                        <button
                          onClick={() => {
                            exportToCSV();
                            setShowExportMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Exportar CSV
                        </button>
                        <button
                          onClick={() => {
                            exportToExcel();
                            setShowExportMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Exportar Excel
                        </button>
                        <div className="border-t border-slate-200 my-2"></div>
                        <div className="px-3 py-2 text-xs text-slate-500">
                          {filteredArrivals.length} participante
                          {filteredArrivals.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCardStyle(cardStyle === "grid" ? "list" : "grid")
                  }
                >
                  {cardStyle === "grid" ? (
                    <List className="h-4 w-4" />
                  ) : (
                    <Grid className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Lista de participantes */}
            {filteredArrivals.length === 0 ? (
              <Card className="text-center py-20">
                <CardContent>
                  <UserCheck className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {searchTerm
                      ? "Nenhum resultado encontrado"
                      : "Aguardando participantes"}
                  </h2>
                  <p className="text-slate-500">
                    {searchTerm
                      ? "Tente ajustar os termos de busca"
                      : "Os participantes aparecerão aqui conforme chegam ao evento"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  cardStyle === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredArrivals.map((arrival, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      {cardStyle === "grid" ? (
                        <div className="text-center">
                          <Avatar className="w-16 h-16 mx-auto mb-4">
                            <AvatarImage
                              src={arrival.user?.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-lg font-bold">
                              {getInitials(
                                arrival.fields?.name ||
                                  arrival.user?.name ||
                                  "U"
                              )}
                            </AvatarFallback>
                          </Avatar>

                          <h3 className="font-bold text-lg mb-3 text-slate-900">
                            {arrival.fields?.name ||
                              arrival.user?.name ||
                              "Sem nome"}
                          </h3>

                          <div className="space-y-2">
                            {arrival.user?.email && (
                              <Badge variant="secondary" className="text-xs">
                                {arrival.user.email}
                              </Badge>
                            )}

                            {Object.entries(arrival.fields ?? {})
                              .filter(
                                ([key]) =>
                                  key !== "name" &&
                                  (selectedFields.length === 0 ||
                                    selectedFields.includes(key))
                              )
                              .map(([key, value]) => (
                                <div
                                  key={key}
                                  className="text-sm text-slate-600 bg-slate-50 rounded-lg p-2"
                                >
                                  <span className="font-medium">{key}:</span>{" "}
                                  {value || "Não informado"}
                                </div>
                              ))}

                            {commonParameter && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                                {commonParameter}
                              </Badge>
                            )}
                          </div>

                          {showArrivalTime && (
                            <div className="mt-4 text-sm text-slate-500 bg-slate-50 rounded-lg p-2">
                              Chegou às {formatTime(arrival.arrivalTime)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={arrival.user?.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
                              {getInitials(
                                arrival.fields?.name ||
                                  arrival.user?.name ||
                                  "U"
                              )}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 truncate">
                              {arrival.fields?.name ||
                                arrival.user?.name ||
                                "Sem nome"}
                            </h3>
                            {arrival.user?.email && (
                              <p className="text-sm text-slate-500 truncate">
                                {arrival.user.email}
                              </p>
                            )}
                            {Object.entries(arrival.fields ?? {})
                              .filter(
                                ([key]) =>
                                  key !== "name" &&
                                  (selectedFields.length === 0 ||
                                    selectedFields.includes(key))
                              )
                              .slice(0, 1)
                              .map(([key, value]) => (
                                <p
                                  key={key}
                                  className="text-sm text-slate-500 truncate"
                                >
                                  <span className="font-medium">{key}:</span>{" "}
                                  {value || "Não informado"}
                                </p>
                              ))}
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            {showArrivalTime && (
                              <p className="text-sm text-slate-500">
                                {formatTime(arrival.arrivalTime)}
                              </p>
                            )}
                            {commonParameter && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                                {commonParameter}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
