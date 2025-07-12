"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import {
  Heart,
  MapPin,
  Calendar,
  Users,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  Ticket,
  
  Music,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { TicketSelector } from "@/components/TicketSelector"
import FreeEventForm from "@/components/FreeEventForm"
import Subscribed from "@/pages/Subscribed"
import { useUser } from "@/contexts/useContext"
import type EventInterface from "@/interfaces/EventInterface"

const EventDetail = () => {
  const { id } = useParams()
  const { user } = useUser()

  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [event, setEvents] = useState<EventInterface | undefined>(undefined)
  const [subscribed, setSubscribed] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [showFull, setShowFull] = useState(false)

  console.log(event)

  useEffect(() => {
    const condition = user?.likedEvents.some((e) => e.toString() == id) ?? false
    setIsFavorited(condition)
  }, [user])

  async function handleFavorite() {
    setIsFavorited(!isFavorited)

    if (!isFavorited) {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_LIKE_EVENT}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
    } else {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_REMOVE_LIKE_EVENT}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    }
  }

  const togglePolicy = () => setShowFull((prev) => !prev)
  const policy = event?.policy || ""
  const visibleText = showFull ? policy : `${policy.slice(0, 150)}...`

  useEffect(() => {
    try {
      async function getEvento() {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_EVENT_GETID}${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        )

        if (response.data.event) {
          setEvents(response.data.event)
        }
      }

      getEvento()
    } catch (error) {
      console.log("Erro ao buscar evento", error)
    }
  }, [id])

  if (!event || !id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando evento...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header isScrolled={true} />

      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url("${event?.image}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        {/* Floating elements for visual interest */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-blue-500/20 rounded-full blur-lg animate-pulse delay-1000" />

        <div className="relative h-full flex items-end">
          <div className="container mx-auto px-6 pb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              {/* Event Info */}
              <div className="text-white space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {event?.category || "Evento"}
                    </Badge>
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-white to-white/80 bg-clip-text">
                      {event?.title}
                    </h1>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleFavorite}
                    className={`rounded-full h-14 w-14 transition-all duration-300 backdrop-blur-sm ${
                      isFavorited
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
                        : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${isFavorited ? "fill-current" : ""}`} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/90">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-white/70">Localização</p>
                      <p className="font-semibold">
                        {event?.neighborhood} | {event?.city}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <a href={`/organizer/${event?.organizer._id}`} className="flex items-center gap-3">
                  <Avatar className="h-14 w-14 border-2 border-white/30">
                    <AvatarImage src={event?.organizer.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-white/20 text-white">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white/70 text-sm">Organizado por</p>
                      <p className="text-white font-semibold text-lg">{event?.organizer.name}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Event Image Card */}
              <div className="hidden lg:block">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <img
                    src={event?.image || "/placeholder.svg"}
                    alt={event?.title}
                    className="relative w-full h-96 object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span className="font-medium">Evento imperdível</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">Em breve</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribed Modal */}
      {subscribed ? <Subscribed qrCode={qrCode} open={subscribed} onOpenChange={setSubscribed} /> : null}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl text-gray-800 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                  Sobre o evento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{event?.description}</p>

                {/* Mobile Event Info */}
                <div className="md:hidden mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <p className="text-sm font-medium">
                      {event?.neighborhood} | {event?.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div className="text-sm">
                      {event?.dates && event.dates.length > 0 ? (
                        event.dates.map((period, i) => (
                          <div key={i}>
                            {new Date(period.startDate).toLocaleDateString()} {period.startTime} até{" "}
                            {new Date(period.endDate).toLocaleDateString()} {period.endTime}
                          </div>
                        ))
                      ) : (
                        <span>Sem datas cadastradas</span>
                      )}
                    </div>
                  </div>

                  <a
                    href={`/organizer/${event?.organizer._id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={event?.organizer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="w-5 h-5 text-gray-500" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs text-gray-600">Organizador</p>
                      <p className="text-sm font-medium text-gray-800">{event?.organizer.name}</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Lineup/Attractions Section */}
            {event?.dates &&
              event.dates.length > 0 &&
              event.dates.some((date) => date.attractions && date.attractions.length > 0) && (
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-3xl text-gray-800 flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                      Lineup & Atrações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {event.dates.length === 1 ? (
                      // Single date - no tabs needed
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {new Date(event.dates[0].startDate).toLocaleDateString("pt-BR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-sm text-gray-600">
                              {event.dates[0].startTime} às {event.dates[0].endTime}
                            </p>
                          </div>
                        </div>

                        {event.dates[0].attractions && event.dates[0].attractions.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {event.dates[0].attractions.map((attraction, attractionIndex) => (
                              <div
                                key={attractionIndex}
                                className="group p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                    <Music className="h-5 w-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                                      {attraction.name}
                                    </h4>
                                    {attraction.social && (
                                      <a
                                        href={attraction.social}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 mt-1"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        Ver perfil
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">Nenhuma atração cadastrada para esta data.</p>
                        )}
                      </div>
                    ) : (
                      // Multiple dates - use tabs
                      <Tabs defaultValue="0" className="w-full">
                        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-auto p-1 bg-gray-100">
                          {event.dates.map((date, index) => (
                            <TabsTrigger
                              key={index}
                              value={index.toString()}
                              className="flex flex-col items-center p-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                            >
                              <span className="font-semibold text-sm">
                                {new Date(date.startDate).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </span>
                              <span className="text-xs text-gray-600 mt-1">{date.startTime}</span>
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {event.dates.map((date, index) => (
                          <TabsContent key={index} value={index.toString()} className="mt-6">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3 mb-6">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {new Date(date.startDate).toLocaleDateString("pt-BR", {
                                      weekday: "long",
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {date.startTime} às {date.endTime}
                                  </p>
                                </div>
                              </div>

                              {date.attractions && date.attractions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {date.attractions.map((attraction, attractionIndex) => (
                                    <div
                                      key={attractionIndex}
                                      className="group p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                          <Music className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                                            {attraction.name}
                                          </h4>
                                          {attraction.social && (
                                            <a
                                              href={attraction.social}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 mt-1"
                                            >
                                              <ExternalLink className="h-3 w-3" />
                                              Ver perfil
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-8">
                                  Nenhuma atração cadastrada para esta data.
                                </p>
                              )}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
                  </CardContent>
                </Card>
              )}

            {/* Event Policy */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                  <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                  Política do evento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{visibleText}</p>
                {policy.length > 150 && (
                  <Button
                    variant="ghost"
                    onClick={togglePolicy}
                    className="mt-4 p-0 h-auto text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showFull ? (
                      <>
                        Ver menos <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Ver mais <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl text-gray-800 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <MapPin className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{event?.venueName || "Local do evento"}</h3>
                    <p className="text-gray-600">
                      {event?.street && `${event.street}`}
                      {event?.number && `, ${event.number}`}
                      {event?.complement && ` - ${event.complement}`}
                    </p>
                    <p className="text-gray-600">
                      {event?.neighborhood && `${event.neighborhood}`}
                      {event?.city && `, ${event.city}`}
                      {event?.state && ` - ${event.state}`}
                      {event?.zipCode && ` (${event.zipCode})`}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <iframe
                    src={
                      event?.mapUrl ||
                      (event?.latitude && event?.longitude
                        ? `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${event.latitude},${event.longitude}&zoom=15`
                        : "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1963.4955007216295!2d-48.337388507953854!3d-10.181385600694082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1spt-BR!2sbr!4v1749832543882!5m2!1spt-BR!2sbr")
                    }
                    width="100%"
                    height="350"
                    className="border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tickets */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-800 flex items-center gap-3">
                  <Ticket className="h-6 w-6 text-blue-600" />
                  {event?.isFree ? event.formTitle || "Formulário de Inscrição" : "Ingressos"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event?.isFree ? (
                  <div className="space-y-6">
                    <div className="text-center py-4">
                      <Badge variant="secondary" className="text-lg px-6 py-3 mb-4 bg-green-100 text-green-800">
                        Evento Gratuito
                      </Badge>
                    </div>
                    <FreeEventForm
                      customFields={event?.customFields ?? []}
                      eventId={event._id}
                      setSubscribed={setSubscribed}
                      setQrCode={setQrCode}
                    />
                  </div>
                ) : (
                  <div>
                    {/* Verificação se batches está vazio */}
                    {(!event.batches || event.batches.length === 0) ? (
                      <div className="text-center text-gray-600 py-12">
                        <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">Ingressos Indisponíveis</p>
                        <p className="text-sm text-gray-500">Eventos Indisponíveis no momento.</p>
                      </div>
                    ) : event.currentTickets && event.currentTickets.length > 0 ? (
                      <TicketSelector event={event} tickets={event.currentTickets} />
                    ) : (
                      <div className="text-center text-gray-600 py-12">
                        <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">Não há ingressos à venda no momento.</p>
                        <p className="text-sm text-gray-500">Volte em breve para conferir a disponibilidade.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default EventDetail
