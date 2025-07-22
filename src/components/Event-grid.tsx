import React from "react";
import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EventGrid = () => {
  const [events, setEvents] = React.useState<EventInterface[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
      weekday: date.toLocaleDateString("pt-BR", { weekday: "short" }).replace('.', '').toUpperCase(),
      year: date.getFullYear(),
    };
  };
  const dateInfo = formatDate(currentEvent.dates[0]?.startDate);

  return (
    <section id="event-grid" className="w-full h-fit p-0 m-0">
      <div className="w-full flex justify-center py-0">

        <div className="relative p-15 w-full flex flex-col md:flex-row items-center justify-center min-h-[320px] sm:min-h-[400px] md:min-h-[500px] h-full bg-gradient-to-br from-[#02488C] via-[#023a70] to-[#18181b] shadow-xl overflow-hidden px-4 sm:px-8 md:px-16">
          {/* Imagem e categoria */}
          <div className="relative w-full md:w-1/2 flex justify-center items-center md:order-2">
            <img
              src={currentEvent.image || "/placeholder.svg"}
              alt={currentEvent.title}
              className="w-full md:w-full max-w-full h-[200px] sm:h-[260px] md:h-[340px] object-cover rounded-2xl shadow-2xl border-4 border-white/10"
            />
            {/* Categoria balão sobre a imagem */}
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-rose-500 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-md select-none z-10">
              {currentEvent.category?.slice(0, 32) || <span>&nbsp;</span>}
            </div>
          </div>
          {/* Conteúdo */}
          <div className="w-full md:w-1/2 flex flex-col justify-center md:justify-start h-full gap-2 md:gap-4 px-2 sm:px-6 md:px-10 py-2 md:py-0 md:order-1">
            {/* Data personalizada + título/artista lado a lado no mobile */}
            <div className="flex flex-col sm:flex-row w-full items-center gap-4">
              <div className="w-full sm:w-[140px] sm:min-w-[140px] sm:max-w-[140px] h-[80px] flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm px-2 py-2 rounded-lg border border-white/20 mt-1 flex-shrink-0">
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-white uppercase">{dateInfo.weekday}</span>
                  <span className="text-2xl font-extrabold text-white leading-none">{dateInfo.day}</span>
                  <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider">{dateInfo.month}</span>
                </div>
                <span className="text-base font-bold text-indigo-400 pl-2 border-l border-white/20">{dateInfo.year}</span>
              </div>
              <div className="w-full sm:flex-1 sm:min-w-0 sm:w-auto sm:max-w-full flex flex-col items-center text-center sm:items-start sm:text-left">
                <h1 className="text-2xl md:text-3xl font-extrabold truncate overflow-hidden whitespace-nowrap text-white bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-0 w-full max-w-full">
                  {currentEvent.title?.slice(0, 40) || <span>&nbsp;</span>}
                </h1>
                <h2 className="font-semibold text-[clamp(0.9rem,2vw,1.2rem)] text-gray-300 min-h-[1.4rem] max-h-[1.8rem] mb-0 truncate w-full max-w-full">
                  {currentEvent.dates[0]?.attractions?.map(a => a.name).join(", ").slice(0, 40) || <span>&nbsp;</span>}
                </h2>
              </div>
            </div>
            <p className="text-base text-gray-300 line-clamp-3 mt-1">
              {currentEvent.description?.slice(0, 120) || <span>&nbsp;</span>}
            </p>
            <div className="flex flex-row gap-2 w-full mt-2">
              <button
                className="flex-1 min-w-[120px] py-3 px-2 rounded-lg border border-white/20 bg-white/10 text-white font-bold uppercase text-xs hover:bg-white/20 transition-all"
                onClick={() => handleViewDetails(currentEvent._id)}
              >
                VER DETALHES
              </button>
              <button
                className="flex-1 min-w-[120px] py-3 px-2 rounded-lg bg-gradient-to-r from-[#FEC800] to-[#FF8C00] text-black font-bold uppercase text-xs shadow-md hover:from-[#FEC800]/90 hover:to-[#FF8C00]/90 transition-all"
                onClick={() => handleBuyTicket(currentEvent._id)}
              >
                COMPRAR INGRESSO
              </button>
            </div>
          </div>
          {/* Navegação mobile/tablet: embaixo */}
          <div className="flex justify-center gap-4 mt-4 w-full md:hidden">
            <button
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-white/20 transition-all"
              onClick={prevSlide}
              disabled={isTransitioning}
              aria-label="Anterior"
            >
              <ChevronLeft />
            </button>
            <button
              className="bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md border border-white/20 transition-all"
              onClick={nextSlide}
              disabled={isTransitioning}
              aria-label="Próximo"
            >
              <ChevronRight />
            </button>
          </div>
          {/* Navegação desktop: laterais */}
          <button
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 items-center justify-center shadow-md border border-white/20 transition-all"
            onClick={prevSlide}
            disabled={isTransitioning}
            aria-label="Anterior"
          >
            <ChevronLeft />
          </button>
          <button
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 items-center justify-center shadow-md border border-white/20 transition-all"
            onClick={nextSlide}
            disabled={isTransitioning}
            aria-label="Próximo"
          >
            <ChevronRight />
          </button>
          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {events.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full border-none transition-all ${index === currentIndex ? "bg-white scale-110" : "bg-white/40"}`}
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
