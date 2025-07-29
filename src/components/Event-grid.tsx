"use client";

import React from "react";
import type EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import { ChevronLeft, ChevronRight, MapPin, Clock, Users } from "lucide-react";
import { truncateTextTo30Chars, truncateTextResponsiveForEventGrid } from "@/utils/formatUtils";

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
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (events.length === 0) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00498D] border-t-transparent"></div>
          <p className="text-slate-600 font-medium">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  const currentEvent = events[currentIndex];  
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase(),
      weekday: date
        .toLocaleDateString("pt-BR", { weekday: "short" })
        .replace(".", "")
        .toUpperCase(),
      year: date.getFullYear(),
      fullMonth: date.toLocaleDateString("pt-BR", { month: "long" }),
    };
  };

  console.log(currentEvent.dates);
  const dateInfo = formatDate(currentEvent.dates[0]?.startDate);
  
  return (
    <section className="w-full py-8 lg:py-12 bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Main Event Card */}
        <div className="m-4 sm:m-6 lg:m-10">
          <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl shadow-black/10">
            {/* Image Section */}
            <div className="relative lg:w-1/2">
              <div className="relative overflow-hidden rounded-t-xl lg:rounded-l-2xl lg:rounded-t-none h-60 sm:h-80 lg:h-full">
                <img
                  src={
                    currentEvent.image ||
                    "/placeholder.svg?height=400&width=600"
                  }
                  alt={currentEvent.title}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {currentEvent.category}
                </div>

                {/* Free/Paid Badge */}
                <div className="absolute top-4 right-4">
                  {currentEvent.isFree ? (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      GRATUITO
                    </div>
                  ) : (
                    <div className="bg-[#FDC901] text-black px-3 py-1 rounded-full text-sm font-semibold">
                      PAGO
                    </div>
                  )}
                </div>

                {/* Navigation Arrows - Desktop */}
                <button
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className="hidden lg:flex absolute left-4 top-[45%] -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-slate-800 rounded-full items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                  aria-label="Evento anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextSlide}
                  disabled={isTransitioning}
                  className="hidden lg:flex absolute right-4 top-[45%] -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white text-slate-800 rounded-full items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                  aria-label="Próximo evento"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center rounded-b-xl lg:rounded-r-2xl lg:rounded-b-none">
              {/* Date and Title Section - Side by Side */}
              <div className="flex flex-row items-start gap-3 sm:gap-6 mb-6">
                {/* Title and Subtitle */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 leading-tight line-clamp-1">
                    {truncateTextTo30Chars(currentEvent.title)}
                  </h1>
                  <div className="h-6 sm:h-7 flex items-center">
                    {currentEvent.dates[0]?.attractions?.length > 0 ? (
                      <p className="text-sm sm:text-lg text-slate-600 font-medium leading-none">
                        {truncateTextTo30Chars(
                          currentEvent.dates[0].attractions
                            .map((a) => a.name)
                            .join(", ")
                        )}
                      </p>
                    ) : (
                      <div className="h-6 sm:h-7"></div>
                    )}
                  </div>
                </div>

                {/* Date Card */}
                <div className="flex items-center gap-2 sm:gap-4 bg-slate-100 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 w-fit flex-shrink-0">
                  <div className="flex flex-col items-center text-center min-w-[40px] sm:min-w-[50px] lg:min-w-[60px]">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      {dateInfo.weekday}
                    </span>
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                      {dateInfo.day}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 uppercase">
                      {dateInfo.month}
                    </span>
                  </div>
                  <div className="w-px h-8 sm:h-10 lg:h-12 bg-slate-300"></div>
                  <div className="text-slate-700">
                    <div className="font-semibold text-xs sm:text-sm lg:text-base">{dateInfo.fullMonth}</div>
                    <div className="text-xs text-slate-600">
                      {dateInfo.year}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00498D]" />
                  <span>
                    {currentEvent.city}, {currentEvent.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#00498D]" />
                  <span>{currentEvent.dates[0]?.startTime || "19:00"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00498D]" />
                  <span>
                    {currentEvent.subscribers?.length || 0} inscritos
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="h-16">
                <p className="text-slate-600 leading-relaxed line-clamp-3">
                  {truncateTextResponsiveForEventGrid(currentEvent.description)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleViewDetails(currentEvent._id)}
                  className="flex-1 py-3 px-6 border-2 border-[#00498D] text-[#00498D] font-semibold rounded-xl hover:bg-[#00498D] hover:text-white transition-all duration-200 hover:scale-[1.02]"
                >
                  Ver Detalhes
                </button>

                <button
                  onClick={() => handleBuyTicket(currentEvent._id)}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-[#FDC901] to-[#FFE066] text-black font-semibold rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  {currentEvent.isFree ? "Inscrever-se" : "Comprar Ingresso"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex justify-center gap-4 mb-8 lg:hidden">
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="w-12 h-12 bg-white text-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
            aria-label="Evento anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="w-12 h-12 bg-white text-slate-800 rounded-full flex items-center justify-center shadow-lg border border-slate-200 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
            aria-label="Próximo evento"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-[#FDC901] scale-125"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Ir para evento ${index + 1}`}
            />
          ))}
        </div>

        {/* Event Counter */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            {currentIndex + 1} de {events.length} eventos
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventGrid;
