"use client"

import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { EffectCoverflow, Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Link } from "react-router-dom"
import type SwiperCore from "swiper"
import axios from "axios"

interface ImagesCarrossel {
  urlImage: string
  _id: string
  redirectUrl: string
}

export default function CarrosselMain() {
  const swiperRef = useRef<SwiperCore | null>(null)
  const [images, setImages] = useState<ImagesCarrossel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getCarrossel() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_CARROSSEL_GET}`)

        if (response.data.carrossels) {
          const carrosselImages = response.data.carrossels.map((element: any) => ({
            urlImage: element.urlImage,
            _id: element._id,
            redirectUrl: element.redirectUrl,
          }))
          setImages(carrosselImages)
        }
      } catch (error) {
        console.error("Erro ao carregar carrossel:", error)
      } finally {
        setIsLoading(false)
      }
    }
    getCarrossel()
  }, [])

  const handleSwiperInit = (swiper: SwiperCore) => {
    swiperRef.current = swiper
    setTimeout(() => {
      swiper.update()
      swiper.autoplay?.start()
    }, 100)
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-16">
        <div className="max-w-[100%] h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00498D] border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex justify-center py-16 bg-white">
      <div className="w-full max-w-full">
        <div className="text-center mb-12 mt-8 hidden lg:block">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">Eventos em Destaque</h2>
          <div className="w-24 h-1 bg-[#FDC901] rounded-full mx-auto"></div>
        </div>

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
            rotate: 2,
            stretch: 0,
            depth: 300,
            modifier: 4,
            slideShadows: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet-custom",
            bulletActiveClass: "swiper-pagination-bullet-active-custom",
          }}
          navigation
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="max-w-[100%] h-[300px] sm:h-[400px] md:h-[500px]"
          watchSlidesProgress={true}
          observer={true}
          observeParents={true}
        >
          {images.map((image, idx) => (
            <SwiperSlide key={idx}>
              <Link to={`${image.redirectUrl}`} className="block h-full">
                <div className="relative h-full group overflow-hidden rounded-xl shadow-2xl">
                  <img
                    src={image.urlImage || "/placeholder.svg"}
                    alt={`slide-${idx}`}
                    className="carousel-img w-full h-full object-cover transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        /* Navigation buttons */
        .swiper-button-next,
        .swiper-button-prev {
          color: #00498D !important;
          background: rgba(255, 255, 255, 0.9);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;          
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
          box-shadow: 0 12px 35px rgba(0, 73, 141, 0.25);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px !important;
          font-weight: bold;
        }

        @media (max-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: none;
          }
        }

        /* Custom pagination */
        .swiper-pagination-bullet-custom {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
        }

        .swiper-pagination-bullet-active-custom {
          background: linear-gradient(45deg, #00498D, #FDC901) !important;
          transform: scale(1.3) !important;
          box-shadow: 0 4px 15px rgba(0, 73, 141, 0.3) !important;
        }

        /* Image effects */
        .carousel-img {
          filter: blur(3px) brightness(0.7);
          transition: all 0.7s ease-in-out;
        }

        .swiper-slide-prev .carousel-img,
        .swiper-slide-next .carousel-img {
          filter: blur(1px) brightness(0.85);
        }

        .swiper-slide-active .carousel-img {
          filter: blur(0px) brightness(1);
        }

        /* Slide sizing */
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
  )
}
