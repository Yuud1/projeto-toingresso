"use client";

import React from "react";
import type EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";

const EventGrid = () => {
  const [events, setEvents] = React.useState<EventInterface[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

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

  const handleViewDetails = (eventId: string) => {
    window.location.href = `/evento/${eventId}`;
  };
  const handleBuyTicket = (eventId: string) => {
    window.location.href = `/evento/${eventId}?comprar=1`;
  };

  const autoPlay = true;
  const autoPlayInterval = 6000;

  React.useEffect(() => {
    if (!autoPlay || events.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, events.length]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % events.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };
  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  if (events.length === 0) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="max-w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00498D]"></div>
        </div>
      </div>
    );
  }

  const currentEvent = events[currentIndex];
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("pt-BR", { month: "long" }).toUpperCase(),
      weekday: date
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", "")
        .toUpperCase(),
      year: date.getFullYear(),
    };
  };
  const dateInfo = formatDate(currentEvent.dates[0]?.startDate);

  return (
    <section
      id="event-grid"
      className="w-full h-fit p-0 m-0 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="w-full flex justify-center py-0">
        <div className="relative w-full flex flex-col md:flex-row items-center justify-center min-h-[320px] sm:min-h-[400px] md:min-h-[500px] h-full shadow-2xl overflow-hidden px-4 sm:px-8 md:px-16 bg-gradient-to-br from-white via-gray-50 to-gray-100">
          {/* Image and category */}
          <div className="relative w-full md:w-1/2 flex justify-center items-center md:order-2">
            <div className="relative group w-full">
              <img
                src={currentEvent.image || "/placeholder.svg"}
                alt={currentEvent.title}
                className="w-full md:w-full max-w-full h-[200px] sm:h-[260px] md:h-[340px] object-cover rounded-3xl shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-500"
              />
              {/* Category badge */}
              <div className="absolute top-4 left-4  text-white px-4 py-2 rounded-full text-sm font-bold uppercase shadow-lg z-10 bg-black">
                {currentEvent.category?.slice(0, 32) || <span>&nbsp;</span>}
              </div>
              {/* Rating badge */}
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 flex flex-col justify-center md:justify-start h-full gap-3 md:gap-6 px-2 sm:px-6 md:px-10 py-4 md:py-0 md:order-1">
            {/* Date and title section */}
            <div className="flex flex-col sm:flex-row w-full items-center gap-6">
              <div className="w-full sm:w-[160px] sm:min-w-[160px] sm:max-w-[160px] h-[90px] flex items-center justify-center gap-4 px-4 py-3 rounded-2xl shadow-xl flex-shrink-0">
                <div className="flex flex-col items-center text-black">
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {dateInfo.weekday}
                  </span>
                  <span className="text-3xl font-extrabold leading-none">
                    {dateInfo.day}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {dateInfo.month.slice(0, 3)}
                  </span>
                </div>
                <div className="w-px h-12 bg-white/30"></div>
                <span className="text-lg font-bold text-black">
                  {dateInfo.year}
                </span>
              </div>

              <div className="w-full sm:flex-1 sm:min-w-0 flex flex-col items-center text-center sm:items-start sm:text-left">
                <h1 className="text-2xl md:text-4xl font-extrabold text-black mb-2 leading-tight">
                  {currentEvent.title?.slice(0, 70) || <span>&nbsp;</span>}
                </h1>
                <h2 className="font-semibold text-lg text-gray-600 mb-3">
                  {currentEvent.dates[0]?.attractions
                    ?.map((a) => a.name)
                    .join(", ")
                    .slice(0, 40) || <span>&nbsp;</span>}
                </h2>

                {/* Location and time info */}
                <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-black" />
                    <span>{currentEvent.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-black" />
                    <span>19:00</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base text-gray-600 line-clamp-3 leading-relaxed">
              {currentEvent.description?.slice(0, 120) || <span>&nbsp;</span>}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <button
                className="flex-1 min-w-[140px] py-4 px-4 rounded-xl border-2 border-[#00498D] bg-transparent text-[#00498D] font-bold uppercase text-sm hover:bg-[#00498D] hover:text-white transition-all duration-300 hover:scale-105"
                onClick={() => handleViewDetails(currentEvent._id)}
              >
                Ver Detalhes
              </button>
              {currentEvent.isFree ? (
                <button
                  className="flex-1 min-w-[140px] py-4 px-4 rounded-xl bg-gradient-to-r from-[#FDC901] to-[#FFE066] text-black font-bold uppercase text-sm shadow-lg hover:shadow-xl hover:scale-105 hover:text-white transition-all duration-300"
                  onClick={() => handleBuyTicket(currentEvent._id)}
                >
                  Increver-se
                </button>
              ) : (
                <button
                  className="flex-1 min-w-[140px] py-4 px-4 rounded-xl bg-gradient-to-r from-[#FDC901] to-[#FFE066] text-black font-bold uppercase text-sm shadow-lg hover:shadow-xl hover:scale-105 hover:text-white transition-all duration-300"
                  onClick={() => handleBuyTicket(currentEvent._id)}
                >
                  Comprar Ingresso
                </button>
              )}
            </div>
          </div>

          {/* Mobile/tablet navigation */}
          <div className="flex justify-center gap-4 mt-6 w-full md:hidden">
            <button
              className="bg-white/90 hover:bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-[#00498D]/20 hover:border-[#00498D]/40 transition-all duration-300 hover:scale-110"
              onClick={prevSlide}
              disabled={isTransitioning}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              className="bg-white/90 hover:bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-2 border-[#00498D]/20 hover:border-[#00498D]/40 transition-all duration-300 hover:scale-110"
              onClick={nextSlide}
              disabled={isTransitioning}
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop navigation */}
          <button
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black rounded-full w-12 h-12 items-center justify-center shadow-lg border-2 border-[#00498D]/20 hover:border-[#00498D]/40 transition-all duration-300 hover:scale-110"
            onClick={prevSlide}
            disabled={isTransitioning}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black rounded-full w-12 h-12 items-center justify-center shadow-lg border-2 border-[#00498D]/20 hover:border-[#00498D]/40 transition-all duration-300 hover:scale-110"
            onClick={nextSlide}
            disabled={isTransitioning}
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {events.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full border-none transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#FDC901] scale-125 shadow-lg"
                    : "bg-black/100"
                }`}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                aria-label={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventGrid;
