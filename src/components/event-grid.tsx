import EventInterface from "@/interfaces/eventInterface";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

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
        console.log("Fudeu", error);
      }
    }

    getEvents();
  }, []);

  return (
    <section id="event-grid" className="max-w-7xl mx-auto py-10">
      <h2 className="text-2xl font-bold text-[#414141] mb-6">
        Próximos Eventos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Link
            key={event._id}
            to={`/evento/${event._id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#414141] mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">{event.city}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default EventGrid;
