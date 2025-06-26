import type React from "react"
import { useState, useRef, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Eye, Clock, Star } from "lucide-react"
import { Link } from "react-router-dom"

interface TabProps {
  isActive: boolean
  children: React.ReactNode
  onClick: () => void
  className: string
}

const Tab = ({ isActive, children, onClick, className }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative",
        className,
        isActive ? "text-[#02488C]" : "text-gray-500 hover:text-gray-700",
      )}
    >
      {children}
      {isActive && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />}
    </button>
  )
}

const tabOptions = [
  { value: "eventos", label: "Eventos" },
  { value: "produtores", label: "Produtores" },
] as const

// Dados de exemplo para eventos
const mockEvents = {
  mostViewed: [
    {
      id: 1,
      title: "Show de Rock",
      date: "2024-04-15",
      image: "/placeholder.svg?height=200&width=300",
      views: 1234,
      location: "Centro de Eventos",
    },
    {
      id: 2,
      title: "Festival de Música",
      date: "2024-05-20",
      image: "/placeholder.svg?height=200&width=300",
      views: 987,
      location: "Arena Show",
    },
    {
      id: 3,
      title: "Concerto Clássico",
      date: "2024-06-10",
      image: "/placeholder.svg?height=200&width=300",
      views: 756,
      location: "Teatro Municipal",
    },
  ],
  recentlyViewed: [
    {
      id: 4,
      title: "Teatro Dramático",
      date: "2024-03-10",
      image: "/placeholder.svg?height=200&width=300",
      views: 543,
      location: "Teatro Municipal",
    },
    {
      id: 5,
      title: "Show de Jazz",
      date: "2024-04-05",
      image: "/placeholder.svg?height=200&width=300",
      views: 432,
      location: "Jazz Club",
    },
  ],
  recommended: [
    {
      id: 6,
      title: "Stand-up Comedy",
      date: "2024-04-25",
      image: "/placeholder.svg?height=200&width=300",
      views: 321,
      location: "Casa de Comédia",
    },
    {
      id: 7,
      title: "Festival Gastronômico",
      date: "2024-05-15",
      image: "/placeholder.svg?height=200&width=300",
      views: 654,
      location: "Parque Central",
    },
  ],
}

const mockProducers = [
  {
    id: 1,
    name: "Produções Eventos",
    image: "/placeholder.svg?height=80&width=80",
    eventsCount: 15,
    followers: 1234,
  },
  {
    id: 2,
    name: "Show & Cia",
    image: "/placeholder.svg?height=80&width=80",
    eventsCount: 8,
    followers: 567,
  },
  {
    id: 3,
    name: "Arte & Cultura",
    image: "/placeholder.svg?height=80&width=80",
    eventsCount: 22,
    followers: 890,
  },
  {
    id: 4,
    name: "Música Live",
    image: "/placeholder.svg?height=80&width=80",
    eventsCount: 12,
    followers: 445,
  },
]

const EventCard = ({ event }: { event: any }) => (
  <Link to={`/evento/${event.id}`} className="block group">
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white h-full">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <Eye size={12} />
          <span>{event.views}</span>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-[#02488C] transition-colors">
          {event.title}
        </h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
            <Clock size={12} className="flex-shrink-0" />
            <span>{new Date(event.date).toLocaleDateString("pt-BR")}</span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm truncate">{event.location}</p>
        </div>
      </div>
    </div>
  </Link>
)

const ProducerCard = ({ producer }: { producer: any }) => (
  <Link to={`/organizador/${producer.id}`} className="block group">
    <div className="border rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all duration-300 bg-white">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={producer.image || "/placeholder.svg"}
            alt={producer.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-lg truncate group-hover:text-[#02488C] transition-colors">
            {producer.name}
          </h3>
          <div className="space-y-0.5">
            <p className="text-gray-600 text-xs sm:text-sm">{producer.eventsCount} eventos</p>
            <p className="text-gray-600 text-xs sm:text-sm">{producer.followers.toLocaleString()} seguidores</p>
          </div>
        </div>
      </div>
    </div>
  </Link>
)

interface CarouselProps {
  items: any[]
  renderItem: (item: any) => React.ReactNode
  title: string
  icon: React.ReactNode
}

const Carousel = ({ items, renderItem, title, icon }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [maxScroll, setMaxScroll] = useState(0)
  const [itemWidth, setItemWidth] = useState(0)
  console.log(maxScroll);
  
  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth
      const clientWidth = carouselRef.current.clientWidth
      setMaxScroll(scrollWidth - clientWidth)

      if (items.length > 0) {
        setItemWidth(scrollWidth / items.length + 16)
      }
    }
  }, [items.length, carouselRef])

  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft)
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg sm:text-xl font-semibold">{title}</h2>
        </div>
      </div>

      <div
        className="sm:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 pb-4"
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <div key={item.id} className="snap-start flex-shrink-0 w-[80%]">
            {renderItem(item)}
          </div>
        ))}
      </div>

      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <div key={item.id}>{renderItem(item)}</div>
        ))}
      </div>

      <div className="sm:hidden flex justify-center mt-2 gap-1">
        {items.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              scrollPosition >= index * itemWidth * 0.8 && scrollPosition < (index + 1) * itemWidth * 0.8
                ? "w-4 bg-[#02488C]"
                : "w-1.5 bg-gray-300",
            )}
          />
        ))}
      </div>
    </section>
  )
}

export default function Favorites() {
  const [activeTab, setActiveTab] = useState<"eventos" | "produtores">("eventos")

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24 max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto mt-12">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold mb-4">Meus Favoritos</h1>
          </div>

          <div className="hidden sm:block border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              {tabOptions.map((option) => (
                <Tab
                  key={option.value}
                  isActive={activeTab === option.value}
                  onClick={() => setActiveTab(option.value)}
                  className="cursor-pointer"
                >
                  {option.label}
                </Tab>
              ))}
            </div>
          </div>

          <div className="sm:hidden mb-6">
            <Select value={activeTab} onValueChange={(value: "eventos" | "produtores") => setActiveTab(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {tabOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[calc(100vh-300px)]">
            {activeTab === "eventos" ? (
              <div className="space-y-8 sm:space-y-10">
                <Carousel
                  items={mockEvents.mostViewed}
                  renderItem={(event) => <EventCard event={event} />}
                  title="Mais vistos nas últimas 24h"
                  icon={<Eye className="text-[#02488C] flex-shrink-0" size={18} />}
                />

                <Carousel
                  items={mockEvents.recentlyViewed}
                  renderItem={(event) => <EventCard event={event} />}
                  title="Vistos recentemente"
                  icon={<Clock className="text-[#02488C] flex-shrink-0" size={18} />}
                />

                <section>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Star className="text-[#02488C] flex-shrink-0" size={18} />
                    <h2 className="text-lg sm:text-xl font-semibold">Eventos que você também pode gostar</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {mockEvents.recommended.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {mockProducers.map((producer) => (
                  <ProducerCard key={producer.id} producer={producer} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
