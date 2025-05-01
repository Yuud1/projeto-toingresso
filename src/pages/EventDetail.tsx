import Header from "@/components/header";
import Footer from "@/components/footer";
import { TicketSelector } from "@/components/ticket-selector";
import { User } from "lucide-react";

const EventDetail = () => {
  const event = {
    title: "Festa Sunset",
    dateTime: "10 de Maio, 18:00",
    location: "Praça Central, São Paulo - SP",
    image: "/flyer1.jpg",
    description: "Uma noite inesquecível com música ao vivo e DJ convidados!",
    fullDescription: `Prepare-se para uma noite vibrante de música e energia com DJs renomados em um ambiente único. Vista-se para impressionar e venha curtir o pôr do sol ao som de batidas eletrizantes, com uma estrutura de iluminação e som profissional.`,
    mapUrl: "https://www.google.com/maps/embed?...",
    policy: "Evento para maiores de 18 anos. Documento com foto obrigatório. Ingressos não reembolsáveis.",
    organizer: {
      id: 1,
      name: "Produções Eventos",
      avatar: "/organizer-avatar.jpg",
      profileUrl: "/organizer/1"
    },
    tickets: [
      {
        id: 1,
        name: "Ingresso Inteiro",
        price: 50.0,
        description: "Acesso a todas as áreas do evento",
        available: 100,
      },
      {
        id: 2,
        name: "Ingresso VIP",
        price: 100.0,
        description: "Acesso VIP com área exclusiva e open bar",
        available: 50,
      },
      {
        id: 3,
        name: "Ingresso Meia",
        price: 25.0,
        description: "Acesso a todas as áreas do evento (necessário comprovante)",
        available: 50,
      },
    ],
  };

  return (
    <>
      <Header isScrolled={true} />

      {/* Banner superior da imagem */}
      <div className="relative w-full h-[300px]">
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${event.image})` }}
  ></div>
  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
</div>


      {/* Seção principal: Info + imagem no desktop */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-10 pb-12 -mt-40">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Informações do evento */}
          <div className="space-y-3 text-[#414141]">
            <h1 className="text-3xl md:text-4xl font-bold text-black">{event.title}</h1>
            <p className="text-sm md:text-base">{event.dateTime}</p>
            <p className="text-sm md:text-base">{event.location}</p>
            <p className="text-base">{event.description}</p>
          </div>

          {/* Imagem lateral no desktop */}
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-[250px] object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid md:grid-cols-[2fr_1fr] gap-12">
          {/* Descrição completa */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#414141]">Descrição do evento</h2>
            <p className="text-[#414141] leading-relaxed whitespace-pre-line">
              {event.fullDescription}
            </p>

            {/* Seção do Anunciante */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-[#414141]">Organizador do evento</h3>
              <a 
                href={event.organizer.profileUrl}
                className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {event.organizer.avatar ? (
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
                  <p className="font-medium text-[#414141]">{event.organizer.name}</p>
                  <p className="text-sm text-gray-500">Ver perfil do organizador</p>
                </div>
              </a>
            </div>
          </div>

          {/* Ingressos */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-[#414141]">Ingressos</h2>
            <TicketSelector eventTitle={event.title} tickets={event.tickets} />

            {/* Política */}
            <div className="mt-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-2 text-[#414141]">Política do Evento</h3>
              <p className="text-sm text-[#414141]">{event.policy}</p>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4 text-[#414141]">Localização</h2>
          <div className="w-full h-[400px]">
            <iframe
              src={event.mapUrl}
              width="100%"
              height="100%"
              className="rounded-lg border"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default EventDetail;
