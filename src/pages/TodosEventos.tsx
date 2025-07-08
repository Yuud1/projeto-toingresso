import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import { MapPin, Clock, Calendar, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { truncateTextResponsive } from "@/utils/formatUtils";
import getInitials from "@/utils/getInitials";

const TodosEventos = () => {
  const [events, setEvents] = React.useState<EventInterface[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getEvents() {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_GET_ALL_EVENTS
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.events) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.log("Erro ao buscar eventos", error);
      } finally {
        setLoading(false);
      }
    }

    getEvents();
  }, []);

  // Filtrar eventos
  const filteredEvents = events;

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-[60px] sm:pt-[230px]">
          <div className="max-w-7xl mx-auto py-10 px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Carregando eventos...</div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-[60px] sm:pt-[230px]">
        {/* Lista de Eventos */}
        <div className="max-w-7xl mx-auto py-10 px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou termos de busca.
              </p>
            </div>
          ) : (
            <>
              {/* Resultados */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  {filteredEvents.length} evento
                  {filteredEvents.length !== 1 ? "s" : ""} encontrado
                  {filteredEvents.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Grid de Eventos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredEvents.map((event) => {
                  const isFree = event.isFree;
                  const startDate = new Date(
                    event.startDate
                  ).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  });
                  const startTime = event.startTime?.slice(0, 5) || "";

                  return (
                    <a href={`/evento/${event._id}`} key={event._id}>
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                        {/* Imagem */}
                        <div className="relative">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                isFree
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {isFree ? "Gratuito" : "Pago"}
                            </span>
                          </div>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-4 sm:p-5">
                          <h3 className="font-bold text-lg text-gray-900 truncate">
                            {truncateTextResponsive(event.title)}
                          </h3>

                          {/* Localização */}
                          <div className="flex items-start gap-2 mb-3">
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">
                                {truncateTextResponsive(
                                  `${event.venueName || ""} | ${
                                    event.state || ""
                                  }`
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Data e Hora */}
                          <div className="flex items-center mb-3 justify-between gap-2">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{startDate}</span>
                            </div>
                            {startTime && (
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{startTime}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-gray-600 min-w-0 flex-1">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <p className="text-sm truncate">
                                {truncateTextResponsive(
                                  `${event.neighborhood || ""}, ${
                                    event.city || ""
                                  }`
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Organizador */}
                          <div className="pt-3 border-t border-gray-100 flex">
                            <div className="text-xs text-gray-500 flex items-center justify-center">
                              {event.organizer ? (
                                <span className="font-medium text-gray-700 flex justify-center items-center gap-3">
                                  <Avatar className="w-9 h-9">
                                    <AvatarImage
                                      src={event.organizer.avatar}
                                      alt={event.organizer.name}
                                    />
                                    <AvatarFallback>
                                      {getInitials(event.organizer.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {truncateTextResponsive(event.organizer.name)}
                                </span>
                              ) : (
                                <span className="italic text-gray-400">
                                  Organizador não informado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TodosEventos;
