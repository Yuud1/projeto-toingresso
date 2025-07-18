import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import React from "react";
import { Button } from "./ui/button";
import EventCard from "./EventCard";

const EventGrid = () => {
  const [events, setEvents] = React.useState<EventInterface[]>([]);

  React.useEffect(() => {
    async function getEvents() {
      try {
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
      }
    }

    getEvents();
  }, []);

  // Limitar a exibição a 8 eventos na home
  const displayedEvents = events.slice(0, 8);
  const hasMoreEvents = events.length > 1;

  return (
    <section id="event-grid" className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full h-fit">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-black text-2xl font-bold mb-8 pt-8">
          Próximos Eventos
        </h1>

        {/* Botão "Ver Todos os Eventos" */}
        {hasMoreEvents && (
          <div className="flex justify-end">
            <Button
              onClick={() => (window.location.href = "/todos-eventos")}
              className="bg-[#02488C] hover:bg-[#023a70] text-white px-5 py-4 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 cursor-pointer"
            >
              Todos os Eventos 
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default EventGrid;
