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
  const swiperRef = useRef<SwiperCore | null>(null);
  const [images, setImages] = useState<ImagesCarrossel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getCarrossel() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_CARROSSEL_GET
          }`
        );

        if (response.data.carrossels) {
          const carrosselImages = response.data.carrossels.map((element: any) => ({
            urlImage: element.urlImage,
            _id: element._id,
            redirectUrl: element.redirectUrl,
          }));
          setImages(carrosselImages);
        }
      } catch (error) {
        console.error("Erro ao carregar carrossel:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getCarrossel();
  }, []);

  const handleSwiperInit = (swiper: SwiperCore) => {
    swiperRef.current = swiper;
    // Força a atualização do Swiper após a inicialização
    setTimeout(() => {
      swiper.update();
      swiper.autoplay?.start();
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-10">
        <div className="max-w-[100%] h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-10">
      <Swiper
        onSwiper={handleSwiperInit}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={1.64}
        loop
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 1,
          stretch: 0,
          depth: 200,
          modifier: 5.5,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        navigation
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className="max-w-[100%] h-[300px] sm:h-[400px] md:h-[500px]"
        watchSlidesProgress={true}
        observer={true}
        observeParents={true}
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
          width: 600px;
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
