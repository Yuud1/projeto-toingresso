import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import { MapPin, Clock, Calendar, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { truncateTextResponsive, truncateTextTo30Chars, truncateTextTo39Chars } from "@/utils/formatUtils";
import getInitials from "@/utils/getInitials";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const categoryDisplayNames: Record<string, string> = {
  Shows: "Shows",
  Teatro: "Teatro",
  Esportes: "Esportes",
  Festas: "Festas",
  Comedia: "Comédia",
  Gospel: "Gospel",
  Diversões: "Diversões",
  Publico: "Público",
};

const TodosEventos = () => {
  const [events, setEvents] = React.useState<EventInterface[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [visibleEvents, setVisibleEvents] = React.useState(5);
  const [showLoadMore, setShowLoadMore] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Ler o query param 'categoria' da URL (funciona client-side)
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("categoria");
    setCategory(cat ? decodeURIComponent(cat) : null);
  }, []);

  React.useEffect(() => {
    async function getEvents() {
      try {
        setLoading(true);

        // Se houver categoria, chama endpoint filtrado (reaproveitando sua variavel de ambiente usada antes)
        if (category) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_FILTERED_EVENTS_CATEGORIES}`,
            {
              params: { querySearch: category },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.data?.events) {
            setEvents(response.data.events);
          } else {
            setEvents([]);
          }
        } else {
          // Senão, busca todos eventos
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_ALL_EVENTS}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.data?.events) {
            setEvents(response.data.events);
          } else {
            setEvents([]);
          }
        }
      } catch (error) {
        console.log("Erro ao buscar eventos", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    getEvents();
  }, [category]); // reexecuta quando category mudar

  // Filtrar adicionalmente (caso API não faça filtro por categoria corretamente)
  const filteredEvents = category
    ? events.filter((e) => {
        // Ajuste aqui conforme o campo correto do seu event (ex: e.category, e.type, e.tags)
        // Exemplo genérico:
        return (e.category || "").toLowerCase() === category.toLowerCase();
      })
    : events;

  // Resto da sua lógica para carrossel / paginação
  const carouselEvents = filteredEvents.slice(0, 7);
  const remainingEvents = filteredEvents.slice(7);
  const displayedRemainingEvents = remainingEvents.slice(0, visibleEvents);
  const hasMoreEvents = remainingEvents.length > visibleEvents;

  React.useEffect(() => {
    if (remainingEvents.length > 5) {
      setShowLoadMore(true);
    } else {
      setShowLoadMore(false);
    }
  }, [remainingEvents.length]);

  const handleLoadMore = () => {
    setVisibleEvents(prev => prev + 5);
    if (visibleEvents + 5 >= remainingEvents.length) {
      setShowLoadMore(false);
    }
  };

  // EventCardComponent (mantive como estava)
  const EventCardComponent = ({ event }: { event: EventInterface }) => {
    const isFree = event.isFree;
    const startDate = new Date(event.dates[0].startDate).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
    const startTime = event.dates[0].startTime?.slice(0, 5) || "";

    return (
      <a href={`/evento/${event._id}`}>
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer mb-6 flex flex-col">
          <div className="relative flex-shrink-0 rounded-t-lg" style={{ aspectRatio: '16/9' }}>
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="absolute inset-0 w-full h-full object-cover object-center rounded-t-lg" />
            <div className="absolute top-2 right-2">
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${isFree ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                {isFree ? "Gratuito" : "Pago"}
              </span>
            </div>
          </div>

          <div className="p-2 sm:p-3 flex-1 flex flex-col rounded-b-lg">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate mb-1">
              {truncateTextTo30Chars(event.title)}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate mb-2">
              {event.description ? truncateTextResponsive(event.description) : "Sem descrição"}
            </p>
            <div className="flex items-start gap-1 mb-2">
              <div className="text-xs text-gray-600">
                <p className="font-medium truncate">
                  {truncateTextTo39Chars(`${event.venueName || ""} | ${event.state || ""}`)}
                </p>
              </div>
            </div>
            <div className="flex items-center mb-2 justify-between gap-1">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="w-3 h-3" />
                <span className="text-xs">{startDate}</span>
              </div>
              {startTime && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">{startTime}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-gray-600 min-w-0 flex-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <p className="text-xs truncate">
                  {truncateTextResponsive(`${event.neighborhood || ""}, ${event.city || ""}`)}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex mt-auto">
              <div className="text-xs text-gray-500 flex items-center justify-center">
                {event.organizer ? (
                  <span className="font-medium text-gray-700 flex justify-center items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                      <AvatarFallback className="text-xs">{getInitials(event.organizer?.name)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{truncateTextResponsive(event.organizer.name)}</span>
                  </span>
                ) : (
                  <span className="italic text-gray-400 text-xs">Organizador não informado</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </a>
    );
  };

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
      <main className="pt-[120px] sm:pt-[230px] bg-[#fafafa]">
        <div className="max-w-6xl mx-auto py-10 px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-600">Tente ajustar os filtros ou termos de busca.</p>
            </div>
          ) : (
            <>
              <div className="w-full flex flex-row justify-between items-center mb-10">
                <div>
                  <h1 className="text-black text-3xl md:text-3xl font-bold mb-2">
                    {category ? (categoryDisplayNames[category] || category) : "Todos os Eventos"}
                  </h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-[#FDC901] to-[#FFE066] rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""} encontrado{filteredEvents.length !== 1 ? "s" : ""}
                </p>
              </div>

              {carouselEvents.length > 0 && (
                <div className="mb-8">
                  <div className="relative">
                    <Swiper
                      slidesPerView={1.5}
                      spaceBetween={20}
                      loop={false}
                      centeredSlides={false}
                      navigation={{
                        nextEl: ".swiper-button-next-carousel",
                        prevEl: ".swiper-button-prev-carousel",
                      }}
                      modules={[Navigation]}
                      className="pb-10"
                      breakpoints={{
                        320: { slidesPerView: 1.6, spaceBetween: 16 },
                        640: { slidesPerView: 2.2, spaceBetween: 20 },
                        768: { slidesPerView: 2.3, spaceBetween: 24 },
                        1024: { slidesPerView: 3.2, spaceBetween: 24 },
                        1280: { slidesPerView: 3.2, spaceBetween: 24 },
                      }}
                    >
                      {carouselEvents.map((event) => (
                        <SwiperSlide key={event._id} className="h-auto">
                          <EventCardComponent event={event} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              )}

              {displayedRemainingEvents.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                  {displayedRemainingEvents.map((event) => (
                    <EventCardComponent key={event._id} event={event} />
                  ))}
                </div>
              )}

              {showLoadMore && hasMoreEvents && (
                <div className="text-center mt-8">
                  <button onClick={handleLoadMore} className="bg-[#00498D] hover:bg-[#003366] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    Ver Mais Eventos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TodosEventos;
