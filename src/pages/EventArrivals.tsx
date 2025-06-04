import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Clock, MapPin, Instagram, Sparkles, Calendar, Timer, UserCheck } from 'lucide-react'
import { cn } from "@/lib/utils"

interface UserTicketsInterface {
  _id: string
  eventId: string
  ticketType: string
  purchaseDate: string
  isUsed: boolean
}

interface UserInterface {
  _id: string
  name: string
  cpf: string
  email: string
  emailVerified: string
  birthdaydata: string
  type: "user" | "superUser" | "admin"
  mysite: string
  instagram: string
  facebook: string
  phoneNumber: string
  avatar: string
  tickets: UserTicketsInterface[]
}

interface EventArrival extends UserInterface {
  arrivalTime: string
  isNew: boolean
}

// Mock data para o evento
const eventData = {
  title: "Workshop de React Avançado 2024",
  date: "15 de Janeiro, 2024",
  time: "09:00 - 18:00",
  location: "Centro de Convenções - São Paulo",
  totalExpected: 150,
  currentArrivals: 0,
}

// Mock data para chegadas
const mockArrivals: UserInterface[] = [
  {
    _id: "1",
    name: "Ana Silva",
    cpf: "123.456.789-00",
    email: "ana@email.com",
    emailVerified: "true",
    birthdaydata: "1990-05-15",
    type: "user",
    mysite: "",
    instagram: "@ana_silva_dev",
    facebook: "",
    phoneNumber: "",
    avatar: "/placeholder.svg?height=100&width=100",
    tickets: [],
  },
  {
    _id: "2",
    name: "Carlos Mendes",
    cpf: "987.654.321-00",
    email: "carlos@email.com",
    emailVerified: "true",
    birthdaydata: "1985-08-22",
    type: "user",
    mysite: "",
    instagram: "@carlos_tech",
    facebook: "",
    phoneNumber: "",
    avatar: "/placeholder.svg?height=100&width=100",
    tickets: [],
  },
  {
    _id: "3",
    name: "Maria Santos",
    cpf: "456.789.123-00",
    email: "maria@email.com",
    emailVerified: "true",
    birthdaydata: "1992-12-03",
    type: "user",
    mysite: "",
    instagram: "@maria_designer",
    facebook: "",
    phoneNumber: "",
    avatar: "/placeholder.svg?height=100&width=100",
    tickets: [],
  },
  {
    _id: "4",
    name: "João Oliveira",
    cpf: "789.123.456-00",
    email: "joao@email.com",
    emailVerified: "true",
    birthdaydata: "1988-03-18",
    type: "user",
    mysite: "",
    instagram: "@joao_frontend",
    facebook: "",
    phoneNumber: "",
    avatar: "/placeholder.svg?height=100&width=100",
    tickets: [],
  },
  {
    _id: "5",
    name: "Fernanda Costa",
    cpf: "321.654.987-00",
    email: "fernanda@email.com",
    emailVerified: "true",
    birthdaydata: "1991-07-25",
    type: "user",
    mysite: "",
    instagram: "@fe_ux_ui",
    facebook: "",
    phoneNumber: "",
    avatar: "/placeholder.svg?height=100&width=100",
    tickets: [],
  },
  {
    _id: "6",
    name: "Pedro Rodrigues",
    cpf: "654.321.789-00",
    email: "pedro@email.com",
    emailVerified: "true",
    birthdaydata: "1987-11-12",
    type: "user",
    mysite: "",
    instagram: "@pedro_fullstack",
    facebook: "",
    phoneNumber: "",
    avatar: "/placeholder.svg?height=100&width=100",
    tickets: [],
  },
]

export default function EventArrivalsPage() {
  const [arrivals, setArrivals] = useState<EventArrival[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [totalArrivals, setTotalArrivals] = useState(0)

  // Atualizar relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Simular chegadas em tempo real
  useEffect(() => {
    let arrivalIndex = 0

    const simulateArrival = () => {
      if (arrivalIndex < mockArrivals.length) {
        const newArrival: EventArrival = {
          ...mockArrivals[arrivalIndex],
          arrivalTime: new Date().toISOString(),
          isNew: true,
        }

        setArrivals((prev) => [newArrival, ...prev])
        setTotalArrivals((prev) => prev + 1)
        arrivalIndex++

        // Remover flag "isNew" após animação
        setTimeout(() => {
          setArrivals((prev) =>
            prev.map((arrival) => (arrival._id === newArrival._id ? { ...arrival, isNew: false } : arrival)),
          )
        }, 2000)
      }
    }

    // Primeira chegada imediata
    simulateArrival()

    // Chegadas subsequentes a cada 3-8 segundos
    const interval = setInterval(
      () => {
        simulateArrival()
      },
      Math.random() * 5000 + 3000,
    )

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatArrivalTime = (arrivalTime: string) => {
    return new Date(arrivalTime).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Informações do Evento */}
            <div className="text-center lg:text-left">
              <h1 className="text-2xl lg:text-4xl font-bold text-[#02488C] mb-2">{eventData.title}</h1>
              <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#02488C]" />
                  <span className="font-medium">{eventData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#02488C]" />
                  <span>{eventData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#02488C]" />
                  <span>{eventData.location}</span>
                </div>
              </div>
            </div>

            {/* Stats e Relógio */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-[#02488C]">{totalArrivals}</div>
                <div className="text-sm text-gray-600 font-medium">Chegadas</div>
              </div>

              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-mono font-bold text-gray-800">{formatTime(currentTime)}</div>
                <div className="text-sm text-gray-600">Horário atual</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-6 py-8">
        {arrivals.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <UserCheck className="h-10 w-10 text-[#02488C]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Aguardando Chegadas</h2>
            <p className="text-gray-600 text-lg">As chegadas dos participantes aparecerão aqui em tempo real</p>
          </div>
        ) : (
          <>
            {/* Título da Seção */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-12 h-12 bg-[#02488C] rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Bem-vindos ao Evento!</h2>
                <p className="text-gray-600">Acompanhe em tempo real quem está chegando</p>
              </div>
            </div>

            {/* Grid de Chegadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {arrivals.map((arrival, index) => (
                <Card
                  key={arrival._id}
                  className={cn(
                    "group hover:shadow-xl transition-all duration-500 border-2 overflow-hidden",
                    arrival.isNew
                      ? "animate-pulse border-green-400 bg-green-50 shadow-lg shadow-green-200"
                      : "border-blue-200 hover:border-[#02488C] bg-white",
                  )}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardContent className="p-6 text-center relative">
                    {/* Badge de Nova Chegada */}
                    {arrival.isNew && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge className="bg-green-500 text-white animate-bounce">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Novo!
                        </Badge>
                      </div>
                    )}

                    {/* Avatar */}
                    <div className="relative mb-4">
                      <Avatar
                        src={arrival.avatar || "/placeholder.svg"}
                        alt={arrival.name}
                        fallback={
                            <span className="bg-[#02488C] text-white text-lg font-bold flex items-center justify-center w-full h-full">
                            {getInitials(arrival.name)}
                            </span>
                        }
                        />


                      {/* Indicador Online */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Nome */}
                    <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-[#02488C] transition-colors">
                      {arrival.name}
                    </h3>

                    {/* Instagram */}
                    {arrival.instagram && (
                      <div className="flex items-center justify-center gap-2 mb-3 text-gray-600">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span className="text-sm font-medium">{arrival.instagram}</span>
                      </div>
                    )}

                    {/* Horário de Chegada */}
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Timer className="h-4 w-4" />
                      <span className="text-sm">{formatArrivalTime(arrival.arrivalTime)}</span>
                    </div>

                    {/* Efeito de Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#02488C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Estatísticas no Rodapé */}
            <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#02488C] mb-2">{totalArrivals}</div>
                  <div className="text-gray-600 font-medium">Total de Chegadas</div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round((totalArrivals / eventData.totalExpected) * 100)}%
                  </div>
                  <div className="text-gray-600 font-medium">Taxa de Presença</div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{eventData.totalExpected - totalArrivals}</div>
                  <div className="text-gray-600 font-medium">Aguardando</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Efeitos de Fundo */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  )
}