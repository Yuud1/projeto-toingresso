import React, { useEffect, useState } from "react";
import {
  Music2,
  Drama,
  Mic2,
  Presentation,
  Church,
  Trophy,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Calendar,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import { Avatar } from "./ui/avatar";
import { truncateTextResponsive } from "@/utils/formatUtils";

const categories = [
  { icon: <Music2 className="w-6 h-6" />, label: "Shows" },
  { icon: <Drama className="w-6 h-6" />, label: "Teatro" },
  { icon: <Mic2 className="w-6 h-6" />, label: "Comédia" },
  { icon: <Presentation className="w-6 h-6" />, label: "Cursos" },
  { icon: <Church className="w-6 h-6" />, label: "Gospel" },
  { icon: <Trophy className="w-6 h-6" />, label: "Esportes" },
];

const Category: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [eventsCategory, setEventsCategory] = useState<EventInterface[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function getEventsCategory() {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_GET_FILTERED_EVENTS
        }`,
        {
          params: { querySearch: activeCategory },
        }
      );

      if (response.data.events) {
        setEventsCategory(response.data.events);
      }
    }

    getEventsCategory();
  }, [activeCategory]);

  const showCarousel = isMobile
    ? eventsCategory.length > 3
    : eventsCategory.length > 5;

  return (
    <div>
      <h2 className="text-[#414141] text-2xl font-bold mb-8 pt-8">
        Explore Momentos
      </h2>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 place-items-center mb-10"
        id="filter-grid"
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.label;

          return (
            <div
              key={cat.label}
              onClick={() => {
                if (activeCategory === cat.label) {
                  setActiveCategory(null);
                } else {
                  setActiveCategory(cat.label);
                }
              }}
              className={`flex flex-col items-center justify-center w-full aspect-square max-w-[150px] rounded-md shadow-sm cursor-pointer transition-all duration-150 ease-in-out
                ${
                  isActive
                    ? "bg-[#02488C] text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:shadow-md hover:scale-105 active:scale-95"
                }
              `}
            >
              <div
                className={`transition-transform duration-150 ${
                  isActive ? "scale-110 text-white" : "text-[#02488C]"
                }`}
              >
                {cat.icon}
              </div>
              <span className="mt-2 text-center text-sm">{cat.label}</span>
            </div>
          );
        })}
      </div>

      <div className="relative min-h-[250px]">
        {showCarousel ? (
          <>
            <Swiper
              slidesPerView={1.6}
              spaceBetween={20}
              loop={true}
              centeredSlides={true}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              modules={[Navigation]}
              className="pb-10"
              breakpoints={{
                640: { slidesPerView: 1.5 },
                768: { slidesPerView: 2.5 },
                1024: { slidesPerView: 3.5 },
              }}
            >
              {eventsCategory.map((event) => (
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
                      <p className="text-xs text-gray-500">{truncateTextResponsive(event.city)}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-button-prev absolute top-1/2 -left-4 transform -translate-y-1/2 z-10">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="swiper-button-next absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {eventsCategory.map((event) => {
              const isFree = event.isFree;
              const startDate = new Date(event.startDate).toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "short" }
              );
              const startTime = event.startTime.slice(0, 5);

              return (
                <a href={`/evento/${event._id}`} key={event._id}>
                  <div className="w-full h-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer mb-10">
                    <div className="relative">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isFree
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {isFree ? "Gratuito" : "Pago"}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-4 sm:p-5">
                      <h3 className="font-bold text-lg text-gray-900 truncate">
                        {truncateTextResponsive(event.title)}
                      </h3>

                      {/* Localização */}
                      <div className="flex items-start gap-2 mb-3">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">
                            {truncateTextResponsive(`${event.venueName} | ${event.state}`)}
                          </p>
                        </div>
                      </div>

                      {/* Data e Hora */}
                      <div className="flex items-center mb-3 justify-between gap-2">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{startDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{startTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 min-w-0 flex-1">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <p className="text-sm truncate">
                            {truncateTextResponsive(`${event.neighborhood}, ${event.city}`)}
                          </p>
                        </div>
                      </div>

                      {/* Organizador */}
                      <div className="pt-3 border-t border-gray-100 flex">
                        <div className="text-xs text-gray-500 flex items-center justify-center">
                          {event.organizer ? (
                            <span className="font-medium text-gray-700 flex justify-center items-center gap-3">
                              <Avatar
                                src={event.organizer.avatar}
                                className="max-w-10 max-h-10 border"
                              />
                              {truncateTextResponsive(event.organizer.name)}
                            </span>
                          ) : (
                            <span className="italic text-gray-400">
                              Organizador não informado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
