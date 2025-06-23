import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import SwiperCore from "swiper";

const images = [
  { src: "/background-login.png", id: 1 },
  { src: "/background-login.png", id: 2 },
  { src: "/background-login.png", id: 3 },
  { src: "/background-login.png", id: 4 },
  { src: "/background-login.png", id: 5 },
  { src: "/background-login.png", id: 6 },
  { src: "/background-login.png", id: 7 },
  { src: "/background-login.png", id: 8 },
  { src: "/background-login.png", id: 9 },
];

export default function CarrosselMain() {
  const [swiperReady, setSwiperReady] = useState(false);
  const swiperRef = useRef<SwiperCore>();

  useEffect(() => {
    // Aguarda o carregamento completo para iniciar o autoplay
    const timer = setTimeout(() => {
      setSwiperReady(true);
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.start();
      }
    }, 100); // pode aumentar se necessário

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex justify-center py-10">
      {swiperReady && (
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 1,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          navigation
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="max-w-[100%] h-[300px] sm:h-[400px] md:h-[500px]"
        >
          {images.map((image, idx) => (
            <SwiperSlide key={idx} className="swiper-slide-custom">
              <Link to={`/evento/${image.id}`}>
                <img
                  src={image.src}
                  alt={`slide-${idx}`}
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <style>
        {`
    .swiper-button-next,
    .swiper-button-prev {
      color: #facc15;
      transition: color 0.3s ease;
    }

    .swiper-button-next:hover,
    .swiper-button-prev:hover {
      color: #fbbf24;
    }

    @media (max-width: 640px) {
      .swiper-button-next,
      .swiper-button-prev {
        display: none;
      }
    }

    .swiper-slide {
      filter: blur(4px) brightness(0.8);
      transition: filter 0.4s ease;
    }

    .swiper-slide-active {
      filter: none !important;
    }

    .swiper-slide-prev,
    .swiper-slide-next {
      filter: blur(2px) brightness(0.95);
    }

    /* Largura dos slides: desktop e mobile */
    .swiper-slide-custom {
      width: 500px;
    }

    @media (max-width: 640px) {
      .swiper-slide-custom {
        width: 90vw;
      }
    }
  `}
      </style>
    </div>
  );
}
