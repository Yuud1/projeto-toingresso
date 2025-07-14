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
import axios from "axios";

interface ImagesCarrossel {
  urlImage: string;
  _id: string;
  redirectUrl: string;
}

export default function CarrosselMain() {
  const [swiperReady, setSwiperReady] = useState(false);
  const swiperRef = useRef<SwiperCore | null>(null);
  const [images, setImages] = useState<ImagesCarrossel[]>([
    // { urlImage: "/background-login.png", _id: "1", redirectUrl: "/evento/1" },
    // { urlImage: "/background-login.png", _id: "2", redirectUrl: "/evento/2" },
    // { urlImage: "/background-login.png", _id: "3", redirectUrl: "/evento/3" },
    // { urlImage: "/background-login.png", _id: "4", redirectUrl: "/evento/4" },
    // { urlImage: "/background-login.png", _id: "5", redirectUrl: "/evento/5" },
    // { urlImage: "/background-login.png", _id: "6", redirectUrl: "/evento/6" },
    // { urlImage: "/background-login.png", _id: "7", redirectUrl: "/evento/7" },
    // { urlImage: "/background-login.png", _id: "8", redirectUrl: "/evento/8" },
  ]);
  
  useEffect(() => {
    async function getCarrossel() {
      const response = await axios
        .get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_CARROSSEL_GET
          }`
        )        
        
        if (response.data.carrossels) {
          response.data.carrossels.forEach((element: any) => {
            setImages((prev) => [...prev, {urlImage: element.urlImage, _id: element._id, redirectUrl: element.redirectUrl}]);
          });          
        }
    }
    getCarrossel();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSwiperReady(true);
      if (swiperRef.current?.autoplay) {
        swiperRef.current.autoplay.start();
      }
    }, 100);
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
            modifier: 3.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          navigation
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="max-w-[100%] h-[300px] sm:h-[400px] md:h-[500px]"
        >
          {images.map((image, idx) => (
            <SwiperSlide key={idx} className="swiper-slide-custom">
              <Link to={`${image.redirectUrl}`}>
                <img
                  src={image.urlImage}
                  alt={`slide-${idx}`}
                  className="carousel-img w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <style>{`
        /* Navegação */
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

        /* Imagem com filtro suave e transição */
        .carousel-img {
          filter: blur(4px) brightness(0.6);
          transition: filter 0.6s ease-in-out;
        }

        .swiper-slide-prev .carousel-img,
        .swiper-slide-next .carousel-img {
          filter: blur(2px) brightness(0.85);
        }

        .swiper-slide-active .carousel-img {
          filter: blur(0px) brightness(1);
        }

        /* Tamanho dos slides */
        .swiper-slide-custom {
          width: 50em;
        }

        @media (max-width: 640px) {
          .swiper-slide-custom {
            width: 90vw;
          }
        }
      `}</style>
    </div>
  );
}
