import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TicketSelector } from "@/components/TicketSelector";
import { useEffect, useState } from "react";
import { User, Heart, MapPin, Calendar, Users, Clock } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventInterface from "@/interfaces/EventInterface";
import FreeEventForm from "@/components/FreeEventForm";
import Subscribed from "@/pages/Subscribed";
import { useUser } from "@/contexts/useContext";

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useUser();

  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const [event, setEvents] = useState<EventInterface | undefined>(undefined);
  const [subscribed, setSubscribed] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const condition =
      user?.likedEvents.some((e) => e.toString() == id) ?? false;
    setIsFavorited(condition);
  }, [user]);

  async function handleFavorite() {
    setIsFavorited(!isFavorited);

    if (!isFavorited) {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_USER_LIKE_EVENT
        }/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } else {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_USER_REMOVE_LIKE_EVENT
        }/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }
  }

  const [showFull, setShowFull] = useState(false);
  const togglePolicy = () => setShowFull((prev) => !prev);
  const policy = event?.policy || "";
  const visibleText = showFull ? policy : `${policy.slice(0, 60)}...`;

  useEffect(() => {
    try {
      async function getEvento() {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_EVENT_GETID
          }${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.event) {
          setEvents(response.data.event);
        }
      }

      getEvento();
    } catch (error) {
      console.log("Fudeu", error);
    }
  }, [id]);

  if (!event || !id) {
    return null;
  }

  return (
    <>
      <Header isScrolled={true} />
      {/* Banner superior da imagem */}
      <div className="relative w-full h-80 sm:h-96 md:h-[500px] mt-28 sm:mt-16 md:mt-4">
        <div
          className="absolute mb-10 inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url("${event?.image}")` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>

        {/* Seção principal: Info + imagem posicionada dentro do banner */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 h-full flex flex-col justify-end pb-6 sm:pb-8 md:pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-start w-full">
            {/* Informações do evento - apenas desktop */}
            <div className="hidden md:block space-y-4 text-[#414141]">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl md:text-4xl font-bold text-black flex-1 mr-4">
                  {event?.title}
                </h1>
                <button
                  onClick={() => handleFavorite()}
                  className={`w-12 h-12 rounded-full transition-all duration-300 bg-red-500 
                    flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl flex-shrink-0
                    ${
                      isFavorited
                        ? "bg-red-500 text-white hover:bg-red-600 transform scale-110"
                        : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500 border border-gray-200"
                    }`}
                  title="Favoritar evento"
                >
                  <Heart
                    className={`h-6 w-6 transition-all duration-300 ${
                      isFavorited ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Neighborhood | City com ícone */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <p className="text-base">
                  {event?.neighborhood} | {event?.city}
                </p>
              </div>

              {/* Data - Horário com ícone */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <p className="text-base">
                  {event?.startDate &&
                    new Date(event.startDate).toLocaleDateString()}{" "}
                  - {event?.startTime}
                </p>
              </div>

              {/* Organizador */}
              <a
                href={`/organizer/${event?.organizer._id}`}
                className="flex items-center gap-3 pt-2 py-3 pr-3 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {event?.organizer.avatar ? (
                    <img
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Organizador</p>
                  <p className="font-medium text-[#414141]">
                    {event?.organizer.name}
                  </p>
                </div>
              </a>
            </div>

            {/* Título apenas mobile */}
            <div className="md:hidden space-y-3 text-[#414141] bg-white/80 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#414141] flex-1 mr-3 ">
                  {event?.title}
                </h1>
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`w-10 h-10 rounded-full transition-all duration-300 
                    flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl flex-shrink-0
                    ${
                      isFavorited
                        ? "bg-red-500 text-white hover:bg-red-600 transform scale-110"
                        : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500 border border-gray-200"
                    }`}
                  title="Favoritar evento"
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-300 ${
                      isFavorited ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Imagem lateral no desktop com hover */}
            <div className="h-56 sm:h-72 md:h-80 relative group">
              <img
                src={event?.image}
                alt={event?.title}
                className="w-full h-full object-cover rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl transform group-hover:scale-[1.01]"
              />

              {/* Overlay de informações na imagem */}
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Evento imperdível</span>
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 ml-auto" />
                  <span>Em breve</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Seção principal: Info + imagem no desktop */}
      {subscribed ? (
        <Subscribed
          qrCode={qrCode}
          open={subscribed}
          onOpenChange={setSubscribed}
        ></Subscribed>
      ) : null}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 sm:gap-8 md:gap-12">
          {/* Descrição completa */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#414141]">
              Descrição do evento
            </h2>
            <p className="text-sm sm:text-base text-[#414141] leading-relaxed whitespace-pre-line">
              {event?.description}
            </p>

            {/* Informações do evento - apenas mobile */}
            <div className="md:hidden mt-6 p-4 bg-gray-50 rounded-lg space-y-3">
              {/* Neighborhood | City com ícone */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <p className="text-sm">
                  {event?.neighborhood} | {event?.city}
                </p>
              </div>

              {/* Data - Horário com ícone */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <p className="text-sm">
                  {event?.startDate &&
                    new Date(event.startDate).toLocaleDateString()}{" "}
                  - {event?.startTime}
                </p>
              </div>

              {/* Organizador */}
              <a
                href={`/organizer/${event?.organizer._id}`}
                className="flex items-center gap-3 pt-2 py-2 pr-3 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {event?.organizer.avatar ? (
                    <img
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-600">Organizador</p>
                  <p className="text-sm font-medium text-[#414141]">
                    {event?.organizer.name}
                  </p>
                </div>
              </a>
            </div>

            {/* Política do Evento */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2 text-sm sm:text-base text-[#414141]">
                Política do Evento
              </h3>
              <p className="text-xs sm:text-sm text-[#414141] break-words whitespace-pre-line">
                {visibleText}
              </p>
              {policy.length > 55 && (
                <button
                  onClick={togglePolicy}
                  className="mt-2 text-blue-600 hover:underline text-xs sm:text-sm"
                >
                  {showFull ? "Ver menos" : "Ver mais"}
                </button>
              )}
            </div>

            {/* Localização com hover */}
            <div className="mt-8 sm:mt-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#414141]">
                Localização
              </h2>
              
              {/* Informações do endereço */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-[#414141]">
                    {event?.venueName || 'Local do evento'}
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  {event?.street && `${event.street}`}
                  {event?.number && `, ${event.number}`}
                  {event?.complement && ` - ${event.complement}`}
                </p>
                <p className="text-sm text-gray-700">
                  {event?.neighborhood && `${event.neighborhood}`}
                  {event?.city && `, ${event.city}`}
                  {event?.state && ` - ${event.state}`}
                  {event?.zipCode && ` (${event.zipCode})`}
                </p>
              </div>
              
              {/* Mapa */}
              <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
                <iframe
                  src={event?.mapUrl || (event?.latitude && event?.longitude 
                    ? `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${event.latitude},${event.longitude}&zoom=15`
                    : "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1963.4955007216295!2d-48.337388507953854!3d-10.181385600694082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9324cb6b090918a5%3A0xec2ad53ac4f6cb12!2sBrasif%20M%C3%A1quinas!5e0!3m2!1spt-BR!2sbr!4v1749832543882!5m2!1spt-BR!2sbr"
                  )}
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Ingressos com design simples */}
          {event?.isFree ? (
            <div className="w-full max-w-full lg:max-w-[30rem]">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#414141]">
                  {event.formTitle
                    ? event.formTitle
                    : "Formulário de Inscrição"}
                </h2>

                <FreeEventForm
                  customFields={event?.customFields ?? []}
                  eventId={event._id}
                  setSubscribed={setSubscribed}
                  setQrCode={setQrCode}
                />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#414141]">
                Ingressos
              </h2>
              <TicketSelector event={event} tickets={event?.tickets ?? []} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EventDetail;
