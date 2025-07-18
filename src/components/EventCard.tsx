import React from "react";
import { MapPin, Clock, Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { truncateTextResponsive } from "@/utils/formatUtils";
import getInitials from "@/utils/getInitials";
import EventInterface from "@/interfaces/EventInterface";

interface EventCardProps {
  event: EventInterface;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, className = "" }) => {
  const isFree = event.isFree;
  const startDate = new Date(event.dates[0].startDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
  const startTime = event.dates[0].startTime.slice(0, 5);

  return (
    <a href={`/evento/${event._id}`}>
      <div className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer mb-10 h-[420px] flex flex-col ${className}`}>
        {/* Imagem */}
        <div className="relative flex-shrink-0">
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
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 truncate mb-3">
            {truncateTextResponsive(event.title)}
          </h3>

          {/* Localização */}
          <div className="flex items-start gap-2 mb-3 min-h-[3rem]">
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
          <div className="pt-3 border-t border-gray-100 flex mt-auto">
            <div className="text-xs text-gray-500 flex items-center justify-center">
              {event.organizer ? (
                <span className="font-medium text-gray-700 flex justify-center items-center gap-3">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                    <AvatarFallback>{getInitials(event.organizer.name)}</AvatarFallback>
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
};

export default EventCard; 