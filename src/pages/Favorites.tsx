import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import { Eye, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface TabProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className: string;
}

const Tab = ({ isActive, children, onClick, className }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative",
        className,
        isActive
          ? "text-[#02488C]"
          : "text-gray-500 hover:text-gray-700"
      )}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
      )}
    </button>
  );
};

// Dados de exemplo para eventos
const mockEvents = {
  mostViewed: [
    {
      id: 1,
      title: "Show de Rock",
      date: "2024-04-15",
      image: "/event1.jpg",
      views: 1234,
      location: "Centro de Eventos"
    },
    {
      id: 2,
      title: "Festival de Música",
      date: "2024-05-20",
      image: "/event2.jpg",
      views: 987,
      location: "Arena Show"
    }
  ],
  recentlyViewed: [
    {
      id: 3,
      title: "Teatro",
      date: "2024-03-10",
      image: "/event3.jpg",
      location: "Teatro Municipal"
    }
  ],
  recommended: [
    {
      id: 4,
      title: "Stand-up Comedy",
      date: "2024-04-25",
      image: "/event4.jpg",
      location: "Casa de Comédia"
    }
  ]
};

// Dados de exemplo para produtores
const mockProducers = [
  {
    id: 1,
    name: "Produções Eventos",
    image: "/producer1.jpg",
    eventsCount: 15,
    followers: 1234
  },
  {
    id: 2,
    name: "Show & Cia",
    image: "/producer2.jpg",
    eventsCount: 8,
    followers: 567
  }
];

const EventCard = ({ event }: { event: any }) => (
  <Link to={`/evento/${event.id}`} className="block">
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Clock size={14} />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
          <Eye size={14} />
          <span>{event.views} visualizações</span>
        </div>
      </div>
    </div>
  </Link>
);

const ProducerCard = ({ producer }: { producer: any }) => (
  <Link to={`/organizador/${producer.id}`} className="block">
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <img
            src={producer.image}
            alt={producer.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{producer.name}</h3>
          <p className="text-gray-600 text-sm">{producer.eventsCount} eventos</p>
          <p className="text-gray-600 text-sm">{producer.followers} seguidores</p>
        </div>
      </div>
    </div>
  </Link>
);

export default function Favorites() {
  const [activeTab, setActiveTab] = useState<"eventos" | "produtores">("eventos");

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Favoritos</h1>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <Tab
                isActive={activeTab === "eventos"}
                onClick={() => setActiveTab("eventos")}
                className="cursor-pointer"
              >
                Eventos
              </Tab>
              <Tab
                isActive={activeTab === "produtores"}
                onClick={() => setActiveTab("produtores")}
                className="cursor-pointer"
              >
                Produtores
              </Tab>
            </div>
          </div>

          <div className="min-h-[calc(100vh-300px)]">
            {activeTab === "eventos" ? (
              <div className="space-y-8">
                {/* Eventos mais vistos */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="text-[#02488C]" size={20} />
                    <h2 className="text-xl font-semibold">Eventos mais vistos nas últimas 24h 👀</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockEvents.mostViewed.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>

                {/* Vistos recentemente */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-[#02488C]" size={20} />
                    <h2 className="text-xl font-semibold">Vistos recentemente</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockEvents.recentlyViewed.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>

                {/* Recomendados */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="text-[#02488C]" size={20} />
                    <h2 className="text-xl font-semibold">Eventos que você também pode gostar</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockEvents.recommended.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducers.map((producer) => (
                  <ProducerCard key={producer.id} producer={producer} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 