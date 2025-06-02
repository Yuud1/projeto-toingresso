import Header from "@/components/header";
import Footer from "@/components/footer";
import { Calendar, MapPin, Mail, Phone, Globe, Facebook, Instagram } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Event {
  id: number;
  title: string;
  date: string;
  image: string;
  location: string;
  status?: 'upcoming' | 'finished';
}

interface Organizer {
  id: number;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  facebook: string;
  instagram: string;
  events: Event[];
}

const EventList = ({ events, isFinished = false }: { events: Event[], isFinished?: boolean }) => {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {events.map((event) => (
        <a
          key={event.id}
          href={`/event/${event.id}`}
          className={`group block rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow ${
            isFinished ? 'bg-gray-50' : ''
          }`}
        >
          <div className="relative h-48">
            <img
              src={event.image}
              alt={event.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform ${
                isFinished ? 'grayscale' : ''
              }`}
            />
            {isFinished && (
              <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                Encerrado
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Calendar size={14} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
              <MapPin size={14} />
              <span>{event.location}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

const Organizer = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'finished'>('upcoming');

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      // Aqui você faria a chamada para a API para buscar os dados do organizador
      // Por enquanto vamos usar dados mockados
      setOrganizer({
        id: Number(id),
        name: "Canção Nova Brasília/DF",
        avatar: "/organizer-avatar.jpg",
        cover: "/cover-image.jpg",
        description: "Somos uma comunidade católica de amor e adoração que comunica a Boa Nova de Jesus Cristo no poder do Espírito Santo.",
        location: "Brasília, DF",
        email: "contato@cancaonova.com",
        phone: "(61) 3333-4444",
        website: "www.cancaonova.com",
        facebook: "facebook.com/cancaonova",
        instagram: "@cancaonova",
        events: [
          {
            id: 1,
            title: "Encontro de Adoração",
            date: "15 de Maio, 2024",
            image: "/event1.jpg",
            location: "Centro de Eventos Canção Nova",
            status: 'upcoming'
          },
          {
            id: 2,
            title: "Retiro Espiritual",
            date: "20 de Junho, 2024",
            image: "/event2.jpg",
            location: "Santuário Canção Nova",
            status: 'upcoming'
          },
          {
            id: 3,
            title: "Festival de Música Católica",
            date: "10 de Julho, 2024",
            image: "/event3.jpg",
            location: "Arena Canção Nova",
            status: 'upcoming'
          },
          {
            id: 4,
            title: "Encontro de Jovens 2023",
            date: "15 de Dezembro, 2023",
            image: "/event4.jpg",
            location: "Centro de Eventos Canção Nova",
            status: 'finished'
          },
          {
            id: 5,
            title: "Natal em Família",
            date: "25 de Dezembro, 2023",
            image: "/event5.jpg",
            location: "Santuário Canção Nova",
            status: 'finished'
          }
        ]
      });
    }
  }, [id]);

  if (!organizer) {
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

  const upcomingEvents = organizer?.events.filter(event => event.status === 'upcoming') || [];
  const finishedEvents = organizer?.events.filter(event => event.status === 'finished') || [];

  return (
    <>
      <Header isScrolled={true} />

      {/* Banner do perfil */}
      <div className="relative w-full h-[300px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${organizer.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Informações principais */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Avatar e nome */}
        <div className="relative -mt-20 mb-8 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
            <img
              src={organizer.avatar}
              alt={organizer.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-center">{organizer.name}</h1>
          <div className="flex items-center gap-2 mt-2 mb-2 text-gray-600">
            <MapPin size={16} />
            <span>{organizer.location}</span>
          </div>
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-4 py-2 rounded-md border-2 text-sm font-medium transition-colors
              flex items-center justify-center cursor-pointer
              ${isFollowing ? "bg-blue-100 border-none text-[#02488C]" : "bg-transparent border-gray-300 text-gray-600 hover:bg-gray-100"}`}
            title={isFollowing ? "Deixar de seguir" : "Seguir"}
          >
            {isFollowing ? "Seguindo" : "Seguir"}
          </button>

        </div>

        {/* Grid de informações */}
        <div className="grid md:grid-cols-[2fr_1fr] gap-12 pb-16">
          {/* Coluna principal */}
          <div className="space-y-8">
            {/* Sobre */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Sobre</h2>
              <p className="text-gray-600 leading-relaxed">{organizer.description}</p>
            </section>

            {/* Eventos */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Eventos</h2>
              <div className="w-full">
                <div className="flex border-b border-gray-200 mb-8">
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-4 py-2 text-base font-medium ${
                      activeTab === 'upcoming'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Próximos Eventos
                  </button>
                  <button
                    onClick={() => setActiveTab('finished')}
                    className={`px-4 py-2 text-base font-medium ${
                      activeTab === 'finished'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Eventos Encerrados
                  </button>
                </div>

                {activeTab === 'upcoming' ? (
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
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4">Informações de Contato</h3>
              
              {organizer.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={18} />
                  <a href={`mailto:${organizer.email}`} className="hover:text-blue-600">
                    {organizer.email}
                  </a>
                </div>
              )}
              
              {organizer.phone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={18} />
                  <a href={`tel:${organizer.phone}`} className="hover:text-blue-600">
                    {organizer.phone}
                  </a>
                </div>
              )}
              
              {organizer.website && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Globe size={18} />
                  <a href={`https://${organizer.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    {organizer.website}
                  </a>
                </div>
              )}
            </div>

            {/* Redes sociais */}
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
                    href={`https://instagram.com/${organizer.instagram.replace('@', '')}`}
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
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Organizer; 