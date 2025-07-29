import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

import { Clock, MapPin, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { truncateTextResponsive, truncateTextTo30Chars } from "@/utils/formatUtils";
import axios from "axios";
import EventInterface from "@/interfaces/EventInterface";
import getInitials from "@/utils/getInitials";

export default function Favorites() {
  const [likedEvents, setLikedEvents] = useState<EventInterface[]>([]);
  console.log(likedEvents);

  useEffect(() => {
    async function getLikedEvents() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_USER_LIKED_EVENTS
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.likedEvents) {
          setLikedEvents(response.data.likedEvents);
        }
      } catch (error) {
        console.log("Erro ao buscar eventos", error);
      }
    }

    getLikedEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24 max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto mt-12">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold mb-4">Meus Favoritos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {likedEvents.length === 0 ? (
                <div className="text-center py-16 col-span-full">
                  <p className="text-gray-600 mb-4">
                    Você ainda não favoritou nenhum evento
                  </p>
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="bg-[#02488C] hover:bg-[#02488C]/90 cursor-pointer"
                  >
                    Ver Eventos
                  </Button>
                </div>
              ) : (
                likedEvents.map((event) => {
                  const isFree = event.isFree;
                  const startDate = new Date(event.dates[0].startDate).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "short",
                    }
                  );
                  const startTime = event.dates[0].startTime.slice(0, 5);

                  return (
                    <a href={`/evento/${event._id}`} key={event._id}>
                      <div className="w-full h-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer mb-10">
                        {/* Imagem */}
                        <div className="relative" style={{ aspectRatio: '16/9' }}>
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover object-center"
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
                            {truncateTextTo30Chars(event.title)}
                          </h3>

                          {/* Localização */}
                          <div className="flex items-start gap-2 mb-3">
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">
                                {truncateTextResponsive(
                                  `${event.venueName} | ${event.state}`
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
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{startTime}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600 min-w-0 flex-1">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <p className="text-sm truncate">
                                {truncateTextResponsive(
                                  `${event.neighborhood}, ${event.city}`
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
                })
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
