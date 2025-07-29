import React from "react";
import { MapPin, Clock, Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { truncateTextResponsive, truncateTextTo30Chars } from "@/utils/formatUtils";
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
      <div className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer mb-6 flex flex-col ${className}`}>
        {/* Imagem */}
        <div className="relative flex-shrink-0" style={{ aspectRatio: '16/9' }}>
          <img
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute top-2 right-2">
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                isFree ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              {isFree ? "Gratuito" : "Pago"}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-2 sm:p-3 flex-1 flex flex-col">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate mb-1">
            {truncateTextTo30Chars(event.title)}
          </h3>

          {/* Descrição - limitada a 1 linha */}
          <p className="text-xs sm:text-sm text-gray-600 truncate mb-2">
            {event.description ? truncateTextResponsive(event.description) : "Sem descrição"}
          </p>

          {/* Localização */}
          <div className="flex items-start gap-1 mb-2">
            <div className="text-xs text-gray-600">
              <p className="font-medium truncate">
                {truncateTextResponsive(`${event.venueName} | ${event.state}`)}
              </p>
            </div>
          </div>

          {/* Data e Hora */}
          <div className="flex items-center mb-2 justify-between gap-1">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">{startDate}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{startTime}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600 min-w-0 flex-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <p className="text-xs truncate">
                {truncateTextResponsive(`${event.neighborhood}, ${event.city}`)}
              </p>
            </div>
          </div>

          {/* Organizador */}
          <div className="pt-2 border-t border-gray-100 flex mt-auto">
            <div className="text-xs text-gray-500 flex items-center justify-center">
              {event.organizer ? (
                <span className="font-medium text-gray-700 flex justify-center items-center gap-2">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                    <AvatarFallback className="text-xs">{getInitials(event.organizer.name)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{truncateTextResponsive(event.organizer.name)}</span>
                </span>
              ) : (
                <span className="italic text-gray-400 text-xs">
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