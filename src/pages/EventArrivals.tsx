import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import {
  User,
  Settings,
  Eye,
  Plus,
  Check,
  X,
  LogOut,
  UserCheck,
  Calendar,
  Clock,
  MapPin,  
  List,
  Grid,
  Users,
  Sparkles,
} from "lucide-react";
import { useParams } from "react-router-dom";
import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import ArrivalInterface from "@/interfaces/ArrivalsInterface";

const socket = io(`${import.meta.env.VITE_API_BASE_URL}`);

export default function EventArrivalsPage() {
  const { id } = useParams();

  const [arrivals, setArrivals] = useState<ArrivalInterface[]>([]);
  const [isConfigMode, setIsConfigMode] = useState(true);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // const [selectedCustomFields] = useState<string[]>(["cargo", "empresa"]);
  const [showArrivalTime, setShowArrivalTime] = useState(true);
  const [cardStyle, setCardStyle] = useState<"grid" | "list">("grid");
  const [previewMode, setPreviewMode] = useState(false);
  const [commonParameter, setCommonParameter] = useState<string>("");
  const [eventData, setEventData] = useState<EventInterface>();

  useEffect(() => {
    try {
      async function getEventById() {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_EVENT_GETID
          }${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response);

        if (response.data.event) {
          setEventData(response.data.event);
        }
      }

      if (id) {
        getEventById();
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    if (!isConfigMode) {
      socket.emit("registerChekcout", id); // entra na sala do evento

      socket.on("new_user_checked_in", (userData: ArrivalInterface) => {
        setArrivals((prev) => [...prev, userData]);
      });
    }

    return () => {
      socket.off("new_user_checked_in");
    };
  }, [isConfigMode, socket]);

  // Atualiza o relógio a cada segundo
  // Esse negócio causa re renderização
  // A não ser que use useMemo não vai poder usar aqui. pq vai bater toda hora na api
  // Melhor tirar mesmo é mais fácil
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentTime(new Date());
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);

  // const formatTime = (date: Date) => {
  //   return date.toLocaleTimeString("pt-BR", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   });
  // };

  // const getInitials = (name: string) => {
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase();
  // };

  // const formatArrivalTime = (arrivalTime: string) => {
  //   return new Date(arrivalTime).toLocaleTimeString("pt-BR", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  // const formatDate = (dateString: string) => {
  //   if (!dateString) return "";
  //   return new Date(dateString).toLocaleDateString("pt-BR");
  // };

  const toggleField = (fieldName: string) => {
    if (selectedFields.includes(fieldName)) {
      setSelectedFields(
        selectedFields.filter((fieldName) => fieldName !== fieldName)
      );
    } else {
      setSelectedFields([...selectedFields, fieldName]);
    }
  };

  const exitCheckout = () => {
    // Função para sair da visualização de checkout
    window.history.back();
  };

  // const getFieldValue = (arrival: ArrivalInterface, fieldId: string) => {
  //   return arrival[fieldId as keyof ArrivalInterface] || "";
  // };

  // const getCustomFieldValue = (arrival: EventArrival, fieldLabel: string) => {
  //   return arrival.customFields?.[fieldLabel.toLowerCase()] || "";
  // };

  // const getFieldIcon = (fieldId: string) => {
  //   const field = defaultFields.find((f) => f.id === fieldId);
  //   return field?.icon || <Info size={16} />;
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header Profissional */}
      <div className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex justify-between items-center gap-4 mb-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#02488C] to-[#0369a1] rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                      {eventData?.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Ativo
                      </span>
                      <span>•</span>
                      {/* isso aqui não existe */}
                      {/* <span>
                        {eventData?.checkedIn} de {eventData?.totalParticipants}{" "}
                        participantes
                      </span> */}
                    </div>
                  </div>
                </div>

                <div>
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
                        {isConfigMode
                          ? "Finalizar Configuração"
                          : "Configurar Exibição"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#02488C]" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {eventData?.startDate}
                    </div>
                    <div className="text-gray-500">{eventData?.startTime}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#02488C]" />
                  <div>
                    <div className="font-medium text-gray-900">Local</div>
                    <div className="text-gray-500">
                      {eventData?.neighborhood}
                    </div>
                  </div>
                </div>
                {/* <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-[#02488C]" />
                  <div>
                    <div className="font-medium text-gray-900">
                      Horário Atual
                    </div>
                    <div className="text-gray-500 font-mono">
                      {formatTime(currentTime)}
                    </div>
                  </div>
                </div> */}
              </div>
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
                    <h2 className="text-2xl font-bold text-gray-900">
                      Configuração de Exibição
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Personalize como os participantes serão exibidos durante o
                      evento
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-3 sm:px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm text-sm"
                  >
                    <Eye size={16} />
                    <span className="whitespace-nowrap">
                      {previewMode ? "Ocultar Preview" : "Mostrar Preview"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
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
                                cardStyle === "grid"
                                  ? "bg-[#FEC800]/30"
                                  : "bg-gray-300"
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
                                cardStyle === "list"
                                  ? "bg-[#FEC800]/30"
                                  : "bg-gray-300"
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
                      {eventData?.customFields.map((field) => (
                        <div
                          key={field._id}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedFields.includes(field._id)
                              ? "border-[#02488C] bg-[#02488C]/5 shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  selectedFields.includes(field._id)
                                    ? "bg-[#02488C] text-white"
                                    : "bg-gray-100 text-gray-500"
                                }`}
                              ></div>
                              <span className="font-medium text-gray-900">
                                {field.label}
                              </span>
                            </div>
                            <button
                              onClick={() => toggleField(field.label)}
                              className={`p-2 rounded-lg transition-all duration-200 ${
                                selectedFields.includes(field.label)
                                  ? "bg-[#02488C] text-white shadow-md"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                              }`}
                            >
                              {selectedFields.includes(field._id) ? (
                                <Check size={16} />
                              ) : (
                                <Plus size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-8">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50/30 p-6 rounded-xl border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#FEC800]" />
                      Parâmetro Comum
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Adicione um parâmetro que será exibido para todos os
                      participantes
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
                            <span className="font-medium text-gray-900">
                              Horário de chegada
                            </span>
                            <p className="text-sm text-gray-500">
                              Mostrar quando cada participante chegou
                            </p>
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
                          <h3 className="font-bold text-lg text-gray-900 mb-3">
                            Ana Silva
                          </h3>
                        )}

                        <div className="space-y-2 w-full">
                          {selectedFields
                            .filter((f) => f !== "name")
                            .map((fieldId) => {
                              const field = eventData?.customFields.find(
                                (f) => f._id === fieldId
                              );
                              if (!field) return null;

                              return (
                                <div
                                  key={fieldId}
                                  className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-2"
                                >
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

                          {commonParameter && (
                            <div className="flex items-center justify-center gap-2 text-[#FEC800] bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                              <Sparkles size={16} />
                              <span className="text-sm font-medium">
                                {commonParameter}
                              </span>
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
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#02488C] to-[#0369a1] rounded-xl shadow-lg">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Participantes Presentes
                  </h2>
                  <p className="text-gray-600">
                    Acompanhe em tempo real as chegadas do evento
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {arrivals.length} presentes
                  </span>
                </div>
                <button
                  onClick={() =>
                    setCardStyle(cardStyle === "grid" ? "list" : "grid")
                  }
                  className="p-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm flex items-center justify-center"
                >
                  {cardStyle === "grid" ? (
                    <List size={18} />
                  ) : (
                    <Grid size={18} />
                  )}
                </button>
              </div>
            </div>

            {arrivals.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-6">
                  <UserCheck className="h-12 w-12 text-[#02488C]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Aguardando Chegadas
                </h2>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  As chegadas dos participantes aparecerão aqui em tempo real
                  conforme eles fizerem check-in
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
                {arrivals.map((arrival) => {
                  return (
                    <div
                      className={`space-y-2${
                        cardStyle === "list"
                          ? "grid grid-cols-2 gap-x-6 gap-y-2"
                          : ""
                      }`}
                    >
                      {Object.entries(arrival.fields).map(([label, value]) => (
                        <div
                          key={label}
                          className={`flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg p-2${
                            cardStyle === "list"
                              ? "text-sm"
                              : "justify-center text-sm"
                          }`}
                        >
                          <span className="font-semibold truncate">
                            {label}:
                          </span>
                          <span className="truncate">{value}</span>
                        </div>
                      ))}
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
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
