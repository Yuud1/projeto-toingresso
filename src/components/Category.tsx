"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"

import type EventInterface from "@/interfaces/EventInterface"
import axios from "axios"
import EventCard from "./EventCard"

// Estilos para animações
const fadeInAnimation = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }
`

const categories = ["Shows", "Teatro", "Esportes", "Festas", "Comedia", "Gospel", "Diversoes", "Publico"]

const categoryDisplayNames = {
  Shows: "Shows",
  Teatro: "Teatro",
  Esportes: "Esportes",
  Festas: "Festas",
  Comedia: "Comédia",
  Gospel: "Gospel",
  Diversoes: "Diversões",
  Publico: "Público",
}

const Category: React.FC = () => {
  const [eventsByCategory, setEventsByCategory] = useState<Record<string, EventInterface[]>>({})
  const [loading, setLoading] = useState(true)
  const [loadedCategories, setLoadedCategories] = useState<Set<string>>(new Set())

  // Injetar estilos de animação
  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = fadeInAnimation
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    async function getEventsForAllCategories() {
      setLoading(true)
      setLoadedCategories(new Set())
      const eventsData: Record<string, EventInterface[]> = {}

      for (const category of categories) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_GET_FILTERED_EVENTS}`,
            {
              params: { querySearch: category },
            },
          )

          if (response.data.events) {
            eventsData[category] = response.data.events
          } else {
            eventsData[category] = []
          }
          
          // Marca a categoria como carregada
          setLoadedCategories(prev => new Set([...prev, category]))
        } catch (error) {
          console.error(`Erro ao buscar eventos da categoria ${category}:`, error)
          eventsData[category] = []
          setLoadedCategories(prev => new Set([...prev, category]))
        }
      }

      setEventsByCategory(eventsData)
      setLoading(false)
    }

    getEventsForAllCategories()
  }, [])

  // Componente de skeleton para o carrossel de eventos
  const EventCarouselSkeleton = ({ category }: { category: string }) => (
    <div className="mb-4">
      <div className="w-full flex flex-row justify-between items-center mb-10">
        <div>
          <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="w-20 h-1 bg-gradient-to-r from-[#FDC901] to-[#FFE066] rounded-full"></div>
        </div>
        <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      <div className="relative min-h-[10em]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
                <div className="w-full h-3 bg-gray-200 rounded"></div>
                <div className="flex justify-between items-center">
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const showCarousel = (events: EventInterface[]) => {
    // Se não há eventos, não mostra carrossel
    if (!events || events.length === 0) {
      return false
    }

    // Se há 1 ou mais eventos, sempre mostra carrossel
    if (events.length >= 1) {
      return true
    }

    // Fallback: mostra carrossel por padrão
    return true
  }

  const handleVerTodos = (category: string) => {
    window.location.href = `/todos-eventos?categoria=${encodeURIComponent(category)}`
  }

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 bg-[#FDC901] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-[#FDC901] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 w-full h-fit relative z-10" id="filter-grid">
        {categories.map((category) => {
          const events = eventsByCategory[category] || []
          const isCategoryLoaded = loadedCategories.has(category)
          
          // Se a categoria ainda não foi carregada, mostra skeleton
          if (!isCategoryLoaded) {
            return <EventCarouselSkeleton key={category} category={category} />
          }
          
          // Se a categoria foi carregada mas não tem eventos, não mostra nada
          if (events.length === 0) return null

          return (
            <div key={category} className="mb-4 animate-fade-in">
              <div className="w-full flex flex-row justify-between items-center mb-10">
                <div>
                  <h1 className="text-black text-3xl md:text-3xl font-bold mb-2">
                    {categoryDisplayNames[category as keyof typeof categoryDisplayNames] || category}
                  </h1>
                  <div className="w-20 h-1 bg-gradient-to-r from-[#FDC901] to-[#FFE066] rounded-full"></div>
                </div>
                <button
                  onClick={() => handleVerTodos(category)}
                  className="group flex items-center gap-2 text-black hover:text-[#FDC901] transition-all duration-300 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
                >
                  <span className="text-sm font-bold">Ver tudo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              <div className="relative min-h-[10em] ">
                {showCarousel(events) ? (
                  <>
                    <Swiper
                      slidesPerView={2.2}
                      spaceBetween={20}
                      loop={false}
                      centeredSlides={false}
                      navigation={{
                        nextEl: `.swiper-button-next-${category}`,
                        prevEl: `.swiper-button-prev-${category}`,
                      }}
                      modules={[Navigation]}
                      className="pb-10"
                      breakpoints={{
                        320: { slidesPerView: 1.2, spaceBetween: 16 },
                        640: { slidesPerView: 2.2, spaceBetween: 20 },
                        768: { slidesPerView: 3.2, spaceBetween: 24 },
                        1024: { slidesPerView: 4.2, spaceBetween: 24 },
                        1280: { slidesPerView: 4.2, spaceBetween: 24 },
                      }}
                    >
                      {events.map((event) => (
                        <SwiperSlide key={event._id} className="h-auto">
                         <EventCard event={event} className="h-full" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <button
                      className={`swiper-button-prev-${category} swiper-button-prev absolute top-1/2 -left-2 sm:-left-4 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110`}
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#00498D]" />
                    </button>
                    <button
                      className={`swiper-button-next-${category} swiper-button-next absolute top-1/2 -right-2 sm:-right-4 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110`}
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#00498D]" />
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {events.map((event) => (
                      <EventCard key={event._id} event={event} className="h-full" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Category
