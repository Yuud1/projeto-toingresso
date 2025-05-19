import React, { useEffect, useState } from "react";
import { Music2, Drama, Mic2, Presentation, Church, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const categories = [
  { icon: <Music2 className="w-6 h-6" />, label: "Festas e Shows" },
  { icon: <Drama className="w-6 h-6" />, label: "Teatros e Espetáculos" },
  { icon: <Mic2 className="w-6 h-6" />, label: "Stand Up Comedy" },
  { icon: <Presentation className="w-6 h-6" />, label: "Congressos e Palestras" },
  { icon: <Church className="w-6 h-6" />, label: "Gospel" },
  { icon: <Trophy className="w-6 h-6" />, label: "Esportes" },
];

const mockEvents = [
  {
    id: 3,
    title: "Stand Up com Afonso Padilha",
    image: "https://source.unsplash.com/random/400x300?comedy",
    city: "Curitiba",
  },
  {
    id: 5,
    title: "Campeonato de Futebol",
    image: "https://source.unsplash.com/random/400x300?soccer",
    city: "Porto Alegre",
  },
  {
    id: 5,
    title: "Campeonato de Futebol",
    image: "https://source.unsplash.com/random/400x300?soccer",
    city: "Porto Alegre",
  },
  {
    id: 6,
    title: "Festival Gospel",
    image: "https://source.unsplash.com/random/400x300?church",
    city: "Salvador",
  },
  {
    id: 6,
    title: "Festival Gospel",
    image: "https://source.unsplash.com/random/400x300?church",
    city: "Salvador",
  },
];

const Category: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showCarousel = isMobile
    ? mockEvents.length > 3
    : mockEvents.length > 5;

  return (
    <div>
      <h2 className="text-[#414141] text-2xl font-bold mb-8 pt-8">Explore Momentos</h2>

      {/* Categorias */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 place-items-center mb-10">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center w-full aspect-square max-w-[130px] bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer transition-shadow"
          >
            {cat.icon}
            <span className="mt-2 text-center text-sm text-gray-700">{cat.label}</span>
          </div>
        ))}
      </div>

      <div className="relative">
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
              {mockEvents.map((event) => (
                <SwiperSlide key={event.id}>
                  <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-500">{event.city}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Botões arredondados */}
            <button className="swiper-button-prev ">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="swiper-button-next">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mockEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {event.title}
                  </h3>
                  <p className="text-xs text-gray-500">{event.city}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
