import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

const images = [
  { src: '/flyer1.jpg', id: 1 },
  { src: '/flyer2.jpeg', id: 2 },
  { src: '/flyer3.jpeg', id: 3 },
  { src: '/flyer4.webp', id: 4 },
  { src: '/background-login.png', id: 5 },
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
          className="w-[90%] max-w-[1000px] h-[300px] sm:h-[400px] md:h-[500px]"
        >
          {images.map((image, idx) => (
            <SwiperSlide key={idx}>
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


