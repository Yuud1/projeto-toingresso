import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const images = [
  '/flyer1.jpg',
  '/flyer2.jpeg',
  '/flyer3.jpeg',
  '/flyer4.webp',
  '/background-login.png'
];

export default function CarrosselMain() {
  return (
    <>
      <div className="w-full flex justify-center py-10">
        <Swiper
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView={2}
          slidesPerGroup={1}
          loop
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          navigation
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          className="w-[90%] max-w-[1000px] h-[500px]"
        >
          {images.map((src, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={src}
                alt={`slide-${idx}`}
                className="w-full h-full object-cover rounded-2xl shadow-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            color: #facc15; /* amarelo (yellow-400) */
            transition: color 0.3s ease;
          }

          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            color: #fbbf24; /* amarelo mais escuro no hover */
          }
        `}
      </style>
    </>
  );
}

