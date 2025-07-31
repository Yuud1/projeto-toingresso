import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Facebook,
  Instagram,
  User,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import EventInterface from "@/interfaces/EventInterface";
import OrganizerInterface from "@/interfaces/OrganizerInterface";
import { truncateTextTo30Chars } from "@/utils/formatUtils";

interface OrganizerData extends OrganizerInterface {
  description?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  cover?: string;
  events?: EventInterface[];
}

const EventList = ({
  events,
  isFinished = false,
}: {
  events: EventInterface[];
  isFinished?: boolean;
}) => {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {events.map((event) => (
        <a
          key={event._id}
          href={`/evento/${event._id}`}
          className={`group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow ${
            isFinished ? "bg-gray-50" : ""
          }`}
        >
          <div className="relative h-48">
            <img
              src={event.image}
              alt={event.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform ${
                isFinished ? "grayscale" : ""
              }`}
            />
            {isFinished && (
              <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                Encerrado
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{truncateTextTo30Chars(event.title)}</h3>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Calendar size={14} />
              <span>{new Date(event.dates[0].startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
              <MapPin size={14} />
              <span>
                {event.neighborhood}, {event.city}
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

const Organizer = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState<OrganizerData | null>(null);
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "finished">(
    "upcoming"
  );
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (id) {
      fetchOrganizerData();
      fetchOrganizerEvents();
    }
  }, [id]);

  const fetchOrganizerData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_ORGANIZER_GET_DATA
        }/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.organizer) {
        const userData = response.data.organizer;

        setOrganizer({
          _id: userData._id,
          avatar: userData.avatar,
          email: userData.email,
          name: userData.name,
          avatarId: userData.avatarId,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do organizador:", error);
    }
  };

  const fetchOrganizerEvents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_ORGANIZER_GET_EVENTS
        }/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Eventos: ", response.data);
      if (response.data.events) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos do organizador:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header isScrolled={true} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-700">Carregando...</h1>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!organizer) {
    return (
      <>
        <Header isScrolled={true} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-700">
              Organizador não encontrado
            </h1>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const upcomingEvents =
    events.filter((event) => event.status === "active") || [];
  const finishedEvents =
    events.filter((event) => event.status === "finished") || [];

  return (
    <>
      <Header isScrolled={true} />

      {/* Banner do perfil */}
      <div className="relative w-full h-[300px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              organizer.cover || "/background-login.png"
            })`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Informações principais */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Avatar e nome */}
        <div className="relative -mt-20 mb-8 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            {organizer.avatar ? (
              <img
                src={organizer.avatar}
                alt={organizer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <User className="w-12 h-12 text-gray-500" />
              </div>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-center">
            {organizer.name}
          </h1>
          {organizer.location && (
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <MapPin size={16} />
              <span>{organizer.location}</span>
            </div>
          )}
        </div>

        {/* Grid de informações */}
        <div className="grid md:grid-cols-[2fr_1fr] gap-12 pb-16">
          {/* Coluna principal */}
          <div className="space-y-8">
            {/* Sobre */}
            {organizer.description && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Sobre</h2>
                <p className="text-gray-600 leading-relaxed">
                  {organizer.description}
                </p>
              </section>
            )}

            {/* Eventos */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Eventos</h2>
              <div className="w-full">
                <div className="flex border-b border-gray-200 mb-8">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-4 py-2 text-base font-medium ${
                      activeTab === "upcoming"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Próximos Eventos
                  </button>
                  <button
                    onClick={() => setActiveTab("finished")}
                    className={`px-4 py-2 text-base font-medium ${
                      activeTab === "finished"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Eventos Encerrados
                  </button>
                </div>

                {activeTab === "upcoming" ? (
                  upcomingEvents.length > 0 ? (
                    <EventList events={upcomingEvents} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum evento programado no momento
                    </div>
                  )
                ) : finishedEvents.length > 0 ? (
                  <EventList events={finishedEvents} isFinished />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum evento encerrado
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Coluna lateral */}
          <div className="space-y-6">
            {/* Card de contato */}
            {(organizer.email || organizer.phone || organizer.website) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                <h3 className="font-semibold text-lg mb-4">
                  Informações de Contato
                </h3>

                {organizer.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={18} />
                    <a
                      href={`mailto:${organizer.email}`}
                      className="hover:text-blue-600"
                    >
                      {organizer.email}
                    </a>
                  </div>
                )}

                {organizer.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone size={18} />
                    <a
                      href={`tel:${organizer.phone}`}
                      className="hover:text-blue-600"
                    >
                      {organizer.phone}
                    </a>
                  </div>
                )}

                {organizer.website && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Globe size={18} />
                    <a
                      href={`https://${organizer.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600"
                    >
                      {organizer.website}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Redes sociais */}
            {(organizer.facebook || organizer.instagram) && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Redes Sociais</h3>
                <div className="space-y-4">
                  {organizer.facebook && (
                    <a
                      href={`https://${organizer.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                    >
                      <Facebook size={18} />
                      <span>Facebook</span>
                    </a>
                  )}

                  {organizer.instagram && (
                    <a
                      href={`https://instagram.com/${organizer.instagram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-600 hover:text-blue-600"
                    >
                      <Instagram size={18} />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Organizer;
