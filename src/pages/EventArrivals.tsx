import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Settings,
  Eye,
  Check,
  X,
  LogOut,
  UserCheck,
  Grid,
  Users,
  Sparkles,
  List,
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
  const [showArrivalTime, setShowArrivalTime] = useState(true);
  const [cardStyle, setCardStyle] = useState<"grid" | "list">("grid");
  const [previewMode, setPreviewMode] = useState(false);
  const [commonParameter, setCommonParameter] = useState<string>("");
  const [eventData, setEventData] = useState<EventInterface>();

  useEffect(() => {
    async function getArrivalsByEventId() {
      let response;

      if (eventData?.isFree) {
        response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_GET_ARRIVALS_FREE_EVENT_ID
          }/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // Para evento gratuito, normalizar para ArrivalInterface-like
        if (response.data.subscribers) {
          setArrivals(
            response.data.subscribers.map((sub: any) => ({
              ...sub.fields,
              fields: sub.fields,
              user: sub.user,
              subscribedAt: sub.subscribedAt,
              arrivalTime: sub.subscribedAt, // ou outro campo se houver
            }))
          );
        }
      } else {
        response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_GET_ARRIVALS_PAID_EVENT_ID
          }/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.participants) {
          setArrivals(response.data.participants);
        }
      }
    }
    if (id) {
      getArrivalsByEventId();
    }
  }, [eventData]);

  useEffect(() => {
    async function getEventById() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_EVENT_GET_SECURE
          }/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.event) {
          setEventData(response.data.event);
        }
      } catch (error: any) {
        console.log(error);
      }
    }

    if (id) {
      getEventById();
    }
  }, [id]);

  useEffect(() => {
    if (!isConfigMode) {
      socket.emit("registerChekcout", id);
      socket.on("new_user_checked_in", (userData: ArrivalInterface) => {
        setArrivals((prev) => [...prev, userData]);
      });
    }

    return () => {
      socket.off("new_user_checked_in");
    };
  }, [isConfigMode, id]);

  const toggleField = (fieldName: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldName)
        ? prev.filter((f) => f !== fieldName)
        : [...prev, fieldName]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {eventData?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {!isConfigMode && (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>AO VIVO</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <LogOut size={16} />
                Sair
              </button>

              <button
                onClick={() => setIsConfigMode(!isConfigMode)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
                  isConfigMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Settings size={16} />
                {isConfigMode ? "Iniciar" : "Configurar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isConfigMode ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Configuração
                  </h2>
                </div>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Estilo */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Estilo
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setCardStyle("grid")}
                        className={`p-3 rounded-lg border transition-all ${
                          cardStyle === "grid"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Grid className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm">Grid</span>
                      </button>
                      <button
                        onClick={() => setCardStyle("list")}
                        className={`p-3 rounded-lg border transition-all ${
                          cardStyle === "list"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <List className="h-6 w-6 mx-auto mb-2" />
                        <span className="text-sm">Lista</span>
                      </button>
                    </div>
                  </div>

                  {/* Campos */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Campos
                    </h3>
                    <div className="space-y-2">
                      {eventData?.customFields.map((field) => (
                        <button
                          key={field._id}
                          onClick={() => toggleField(field.label)}
                          className={`w-full p-3 rounded-lg border flex items-center justify-between transition-all ${
                            selectedFields.includes(field.label)
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{field.label}</span>
                          {selectedFields.includes(field.label) ? (
                            <Check size={16} className="text-blue-600" />
                          ) : (
                            <X size={16} className="text-gray-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parâmetro */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Parâmetro
                    </h3>
                    <input
                      type="text"
                      value={commonParameter}
                      onChange={(e) => setCommonParameter(e.target.value)}
                      placeholder="Ex: VIP, Palestrante..."
                      className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Horário */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">Mostrar horário</span>
                      <button
                        onClick={() => setShowArrivalTime(!showArrivalTime)}
                        className={`p-2 rounded-lg transition-all ${
                          showArrivalTime
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-600"
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

                {/* Preview */}
                {previewMode && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Preview
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold mb-4">
                          AS
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-3">
                          Ana Silva
                        </h3>
                        <div className="space-y-2 w-full">
                          <div className="text-gray-600 bg-gray-50 rounded-lg p-2 text-sm text-center">
                            @ana_silva
                          </div>
                          {commonParameter && (
                            <div className="text-amber-700 bg-amber-50 rounded-lg p-2 text-sm text-center border border-amber-200">
                              {commonParameter}
                            </div>
                          )}
                        </div>
                        {showArrivalTime && (
                          <div className="text-gray-500 mt-4 bg-gray-50 rounded-lg p-2 text-sm text-center">
                            10:15
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
            {/* Controles */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <UserCheck className="h-6 w-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Participantes
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {arrivals.length} presentes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-700 font-medium">
                    {arrivals.length}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setCardStyle(cardStyle === "grid" ? "list" : "grid")
                  }
                  className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                >
                  {cardStyle === "grid" ? (
                    <List size={18} />
                  ) : (
                    <Grid size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Lista */}
            {arrivals.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                <UserCheck className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Aguardando
                </h2>
                <p className="text-gray-500">
                  Os participantes aparecerão aqui
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
                {arrivals.map((arrival, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {cardStyle === "grid" ? (
                      <div className="flex flex-col items-center text-center">
                        {/* Avatar genérico ou personalizado */}
                        {arrival.user?.avatar ? (
                          <img
                            src={arrival.user.avatar}
                            alt={
                              arrival.fields?.name ||
                              arrival.user?.name ||
                              "Avatar"
                            }
                            className="w-16 h-16 rounded-full object-cover mb-4 border"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold mb-4">
                            {getInitials(
                              arrival.fields?.name || arrival.user?.name || "U"
                            )}
                          </div>
                        )}
                        {/* Nome */}
                        <h3 className="font-bold text-lg text-gray-900 mb-3">
                          {arrival.fields?.name ||
                            arrival.user?.name ||
                            "Sem nome"}
                        </h3>
                        {/* Email, se existir */}
                        {arrival.user?.email && (
                          <div className="text-gray-600 bg-gray-50 rounded-lg p-2 text-sm mb-2">
                            {arrival.user.email}
                          </div>
                        )}
                        {/* Campos dinâmicos de fields (exceto name) */}
                        <div className="space-y-2 w-full">
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
                                className="text-gray-600 bg-gray-50 rounded-lg p-2 text-sm"
                              >
                                <span className="font-semibold mr-1">
                                  {key}:
                                </span>{" "}
                                {value}
                              </div>
                            ))}
                        </div>
                        {/* arrivalTime, se mostrar horário estiver ativado */}
                        {showArrivalTime && (
                          <div className="text-gray-500 mt-4 bg-gray-50 rounded-lg p-2 text-sm">
                            {arrival.arrivalTime}
                          </div>
                        )}
                        {/* Parâmetro comum */}
                        {commonParameter && (
                          <div className="text-amber-700 bg-amber-50 rounded-lg p-2 text-sm border border-amber-200 mt-2">
                            {commonParameter}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        {/* Avatar genérico ou personalizado */}
                        {arrival.user?.avatar ? (
                          <img
                            src={arrival.user.avatar}
                            alt={
                              arrival.fields?.name ||
                              arrival.user?.name ||
                              "Avatar"
                            }
                            className="w-12 h-12 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {getInitials(
                              arrival.fields?.name || arrival.user?.name || "U"
                            )}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {arrival.fields?.name ||
                              arrival.user?.name ||
                              "Sem nome"}
                          </h3>
                          {/* Email, se existir */}
                          {arrival.user?.email && (
                            <div className="text-gray-600 text-sm">
                              {arrival.user.email}
                            </div>
                          )}
                          {/* Primeiro campo extra de fields (exceto name) */}
                          <div className="text-gray-500 text-sm">
                            {Object.entries(arrival.fields ?? {})
                              .filter(
                                ([key]) =>
                                  key !== "name" &&
                                  (selectedFields.length === 0 ||
                                    selectedFields.includes(key))
                              )
                              .slice(0, 1)
                              .map(([key, value]) => (
                                <span key={key}>
                                  <span className="font-semibold mr-1">
                                    {key}:
                                  </span>{" "}
                                  {value}
                                </span>
                              ))}
                          </div>
                        </div>
                        {/* arrivalTime, se mostrar horário estiver ativado */}
                        {showArrivalTime && (
                          <div className="text-gray-500 text-sm">
                            {arrival.arrivalTime}
                          </div>
                        )}
                        {/* Parâmetro comum */}
                        {commonParameter && (
                          <div className="text-amber-700 bg-amber-50 rounded-lg px-3 py-1 text-sm border border-amber-200">
                            {commonParameter}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
