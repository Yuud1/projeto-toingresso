import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Music,
  Users,
  PartyPopper,
  RollerCoaster,
  TheaterIcon,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import EventInterface from "@/interfaces/EventInterface";
import axios from "axios";
import { truncateTextResponsive } from "@/utils/formatUtils";
import EventCard from "./EventCard";
import { FaFootballBall } from "react-icons/fa";

const categories = [
  { label: "Shows", icon: <Music /> },
  { label: "Teatro", icon: <TheaterIcon /> },
  { label: "Esportes", icon: <FaFootballBall /> },
  { label: "Festas", icon: <PartyPopper /> },
  { label: "Comédia", icon: <Users /> },
  { label: "Gospel", icon: <Music /> },
  { label: "Diversões", icon: <RollerCoaster /> },
  { label: "Público", icon: <Users /> },
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
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 w-full h-fit">
      <div className="w-full flex flex-row justify-center items-center mb-8">
        <h1 className="text-white text-2xl font-bold pt-8">
          Explore Momentos
        </h1>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-5 lg:gap-6 mb-10 justify-items-center items-center"
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
              className={`flex flex-col items-center justify-center w-full aspect-square max-w-[140px] sm:max-w-[120px] lg:max-w-none rounded-md shadow-sm cursor-pointer transition-all duration-150 ease-in-out
                ${
                  isActive
                    ? "bg-[#02488C] text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:shadow-md hover:scale-105 active:scale-95"
                }
              `}
            >
              <div
                className={`transition-transform duration-150 w-7 h-7 sm:w-6 sm:h-6 lg:w-5 lg:h-5 ${
                  isActive ? "scale-110 text-white" : "text-[#02488C]"
                }`}
              >
                {cat.icon}
              </div>
              <span className="mt-1 text-center text-xs sm:text-sm lg:text-sm font-medium">{cat.label}</span>
            </div>
          );
        })}
      </div>

      <div className="relative min-h-[250px]">
        {showCarousel ? (
          <>
            <Swiper
              slidesPerView={1.6}
              spaceBetween={16}
              loop={true}
              centeredSlides={true}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              modules={[Navigation]}
              className="pb-10"
              breakpoints={{
                640: { slidesPerView: 1.5, spaceBetween: 20 },
                768: { slidesPerView: 2.5, spaceBetween: 24 },
                1024: { slidesPerView: 3.5, spaceBetween: 32 },
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
                      <p className="text-xs text-gray-500">
                        {truncateTextResponsive(event.city)}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button className="swiper-button-prev absolute top-1/2 -left-2 sm:-left-4 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md">
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button className="swiper-button-next absolute top-1/2 -right-2 sm:-right-4 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1 shadow-md">
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {eventsCategory.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
