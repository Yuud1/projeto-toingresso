import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import { truncateTextResponsive } from "@/utils/formatUtils";
import EventCard from "./EventCard";

const categories = [
  "Shows",
  "Teatro", 
  "Esportes",
  "Festas",
  "Comedia",
  "Gospel",
  "Diversoes",
  "Publico"
];

const categoryDisplayNames = {
  "Shows": "Shows",
  "Teatro": "Teatro",
  "Esportes": "Esportes",
  "Festas": "Festas",
  "Comedia": "Comédia",
  "Gospel": "Gospel",
  "Diversoes": "Diversões",
  "Publico": "Público"
};

const Category: React.FC = () => {
  const [eventsByCategory, setEventsByCategory] = useState<Record<string, EventInterface[]>>({});

  useEffect(() => {
    async function getEventsForAllCategories() {
      const eventsData: Record<string, EventInterface[]> = {};
      
      for (const category of categories) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}${
              import.meta.env.VITE_GET_FILTERED_EVENTS
            }`,
            {
              params: { querySearch: category },
            }
          );

          if (response.data.events) {
            eventsData[category] = response.data.events;
          } else {
            eventsData[category] = [];
          }
        } catch (error) {
          console.error(`Erro ao buscar eventos da categoria ${category}:`, error);
          eventsData[category] = [];
        }
      }
      
      setEventsByCategory(eventsData);
    }

    getEventsForAllCategories();
  }, []);

  const showCarousel = () => {
    return true; // Sempre mostrar como carrossel
  };

  const handleVerTodos = (category: string) => {
    window.location.href = `/todos-eventos?categoria=${encodeURIComponent(category)}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full h-fit">
      {categories.map((category) => {
        const events = eventsByCategory[category] || [];
        if (events.length === 0) return null;

        return (
          <div key={category} className="mb-12">
            <div className="w-full flex flex-row justify-between items-center mb-8">
              <h1 className="text-white text-2xl font-bold">
                {categoryDisplayNames[category as keyof typeof categoryDisplayNames] || category}
              </h1>
              <button
                onClick={() => handleVerTodos(category)}
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
              >
                <span className="text-sm font-bold">Ver tudo</span>
              </button>
            </div>

            <div className="relative min-h-[250px]">
              {showCarousel() ? (
                <>
                  <Swiper
                    slidesPerView={2.2}
                    spaceBetween={16}
                    loop={false}
                    centeredSlides={false}
                    navigation={{
                      nextEl: `.swiper-button-next-${category}`,
                      prevEl: `.swiper-button-prev-${category}`,
                    }}
                    modules={[Navigation]}
                    className="pb-10"
                    breakpoints={{
                      320: { slidesPerView: 1.2, spaceBetween: 10 },
                      640: { slidesPerView: 2.2, spaceBetween: 16 },
                      768: { slidesPerView: 3.2, spaceBetween: 20 },
                      1024: { slidesPerView: 4.2, spaceBetween: 24 },
                      1280: { slidesPerView: 5.2, spaceBetween: 28 },
                    }}
                  >
                    {events.map((event) => (
                      <SwiperSlide key={event._id}>
                        <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-40 object-cover"
                          />
                          <div className="p-3">
                            <h3 className="text-sm font-semibold text-gray-800 truncate">
                              {truncateTextResponsive(event.title)}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {truncateTextResponsive(event.city)}
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button className={`swiper-button-prev-${category} swiper-button-prev absolute top-1/2 -left-2 sm:-left-4 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md`}>
                    <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>
                  <button className={`swiper-button-next-${category} swiper-button-next absolute top-1/2 -right-2 sm:-right-4 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md`}>
                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Category;
