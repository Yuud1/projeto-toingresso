interface EventItem {
    id: number;
    image: string;
    title: string;
    dateTime: string;
    location: string;
  }
  
  const events: EventItem[] = [
    {
      id: 1,
      image: "/evento1.jpg",
      title: "Festa Sunset",
      dateTime: "10 de Maio, 18:00",
      location: "Praça Central",
    },
    {
      id: 2,
      image: "/evento2.jpg",
      title: "Stand-up João Silva",
      dateTime: "12 de Maio, 20:00",
      location: "Teatro Municipal",
    },
    {
      id: 3,
      image: "/evento3.jpg",
      title: "Feira de Gastronomia",
      dateTime: "14 de Maio, 11:00",
      location: "Parque da Cidade",
    },
    // Adicione mais eventos aqui
  ];
  
  const EventGrid = () => {
    return (
      <section className="max-w-7xl mx-auto py-10">
        <h2 className="text-2xl font-bold text-[#414141] mb-6">Próximos Eventos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#414141] mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-1">{event.dateTime}</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default EventGrid;
  