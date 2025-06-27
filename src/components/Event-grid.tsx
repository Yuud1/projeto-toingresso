import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import React from "react";
import { MapPin, Clock, Calendar } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { truncateTextResponsive } from "@/utils/formatUtils";

const EventGrid = () => {
  const [events, setEvents] = React.useState<EventInterface[]>([]);

  React.useEffect(() => {
    async function getEvents() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_ALL_EVENTS}`,
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
      }
    }
    

    getEvents();
  }, []);

  return (
    <section id="event-grid" className="max-w-7xl mx-auto py-10">
      <h2 className="text-[#414141] text-2xl font-bold mb-8 pt-8">
        Próximos Eventos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => {
          const isFree = event.isFree;
          const startDate = new Date(event.startDate).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          });
          const startTime = event.startTime.slice(0, 5);

          return (
            <a href={`/evento/${event._id}`} key={event._id}>
              <div className="w-full h-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer mb-10">
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
                        isFree ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {isFree ? "Gratuito" : "Pago"}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                    {truncateTextResponsive(event.title)}
                  </h3>

                  {/* Localização */}
                  <div className="flex items-start gap-2 mb-3">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">
                        {truncateTextResponsive(`${event.venueName} | ${event.state}`)}
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
                        {truncateTextResponsive(`${event.neighborhood}, ${event.city}`)}
                      </p>
                    </div>
                  </div>

                  {/* Organizador */}
                  <div className="pt-3 border-t border-gray-100 flex">
                    <div className="text-xs text-gray-500 flex items-center justify-center">
                      {event.organizer ? (
                        <span className="font-medium text-gray-700 flex justify-center items-center gap-3">
                          <Avatar
                            src={event.organizer.avatar}
                            className="max-w-10 max-h-10 border"
                          />
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
    </section>
  );
};

export default EventGrid;
