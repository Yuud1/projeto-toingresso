import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TicketSelector } from "@/components/TicketSelector";
import { useEffect, useState } from "react";
import { User, Heart } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventInterface from "@/interfaces/EventInterface";
import FreeEventForm from "@/components/FreeEventForm";
import Subscribed from "@/pages/Subscribed";

const EventDetail = () => {
  const { id } = useParams();

  const [isFavorited, setIsFavorited] = useState(false);
  const [event, setEvents] = useState<EventInterface | undefined>(undefined);
  const [subscribed, setSubscribed] = useState(false);
  const [qrCode, setQrCode] = useState(null);

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
      <div className="relative w-full h-[300px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${event?.image}")` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
      </div>
      {/* Seção principal: Info + imagem no desktop */}
      {subscribed ? (
        <Subscribed
          qrCode={qrCode}
          open={subscribed}
          onOpenChange={setSubscribed}
        ></Subscribed>
      ) : null}
      <section className="relative max-w-7xl mx-auto px-6 md:px-10 pb-12 -mt-40">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Informações do evento */}
          <div className="space-y-3 text-[#414141]">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold text-black">
                {event?.title}
              </h1>
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className={`w-10 h-10 rounded-full border-2 transition-colors 
                  flex items-center justify-center cursor-pointer
                  ${
                    isFavorited
                      ? "bg-red-100 border-red-300"
                      : "bg-transparent border-gray-100 hover:bg-gray-500"
                  }`}
                title="Favoritar evento"
              >
                <Heart
                  className={`h-5 w-5 transition-colors ${
                    isFavorited ? "text-red-500" : "text-gray-100"
                  }`}
                />
              </button>
            </div>
            {/* <p className="text-sm md:text-base">{event?.startDate}</p> */}
            <p className="text-sm md:text-base">{event?.neighborhood}</p>
            <p className="text-base">
              {event?.startDate &&
                new Date(event.startDate).toLocaleDateString()}{" "}
              {event?.startTime} até{" "}
              {event?.endDate && new Date(event.endDate).toLocaleDateString()}{" "}
              {event?.endTime}
            </p>

            <p className="text-base">{event?.description}</p>
          </div>

          {/* Imagem lateral no desktop */}
          <img
            src={event?.image}
            alt={event?.title}
            className="w-full h-[250px] object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>{" "}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid md:grid-cols-[2fr_1fr] gap-12">
          {/* Descrição completa */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#414141]">
              Descrição do evento
            </h2>
            <p className="text-[#414141] leading-relaxed whitespace-pre-line">
              {event?.description}
            </p>
            {/* Seção do Anunciante */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-[#414141]">
                Organizador do evento
              </h3>
              <a
                href={event?.organizer.avatar}
                className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ">
                  {event?.organizer.avatar ? (
                    <img
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#414141]">
                    {event?.organizer.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ver perfil do organizador
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Ingressos */}
          {event?.isFree ? (
            <div className="w-full max-w-[30rem]">
              <h2 className="text-xl font-bold mb-4 text-[#414141]">
                {event.formTitle ? event.formTitle : "Formulário de Inscrição"}
              </h2>

              <FreeEventForm
                customFields={event?.customFields ?? []}
                eventId={event._id}
                setSubscribed={setSubscribed}
                setQrCode={setQrCode}
              />

              {/* Política */}
              <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50 w-w-md">
                <h3 className="font-semibold mb-2 text-[#414141]">
                  Política do Evento
                </h3>

                <div className="w-full">
                  <p className="text-sm text-[#414141] break-words whitespace-pre-line">
                    {visibleText}
                  </p>

                  {policy.length > 55 && (
                    <button
                      onClick={togglePolicy}
                      className="mt-2 text-blue-600 hover:underline text-sm"
                    >
                      {showFull ? "Ver menos" : "Ver mais"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-4 text-[#414141]">
                Ingressos
              </h2>
              <TicketSelector event={event} tickets={event?.tickets ?? []} />

              {/* Política */}
              <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-2 text-[#414141]">
                  Política do Evento
                </h3>
                <p className="text-sm text-[#414141]">{event?.policy}</p>
              </div>
            </div>
          )}
        </div>

        {/* Mapa */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4 text-[#414141]">
            Localização
          </h2>
          <div className="w-full h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1963.4955007216295!2d-48.337388507953854!3d-10.181385600694082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9324cb6b090918a5%3A0xec2ad53ac4f6cb12!2sBrasif%20M%C3%A1quinas!5e0!3m2!1spt-BR!2sbr!4v1749832543882!5m2!1spt-BR!2sbr" 
              width="100%"
              height="100%"
              className="rounded-lg border"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EventDetail;
