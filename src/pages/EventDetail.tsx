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
  Star,
  Share2,
  Bookmark,
  Play,
  Sparkles,
  Globe,
  ArrowDown,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { TicketSelector } from "@/components/TicketSelector"
import FreeEventForm from "@/components/FreeEventForm"
import Subscribed from "@/pages/Subscribed"
import { useUser } from "@/contexts/useContext"
import type EventInterface from "@/interfaces/EventInterface"
import AttractionModal from "@/components/AttractionModal"
import LoadingPage from "./LoadingPage"

const EventDetail = () => {
  const { id } = useParams()
  const { user } = useUser()

  const [isFavorited, setIsFavorited] = useState<boolean>(false)
  const [event, setEvents] = useState<EventInterface | undefined>(undefined)
  const [subscribed, setSubscribed] = useState(false)
  const [qrCode, setQrCode] = useState(null)
  const [showFull, setShowFull] = useState(false)
  const [selectedAttraction, setSelectedAttraction] = useState<any | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [openDates, setOpenDates] = useState<{ [key: number]: boolean }>({})

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

  const toggleDate = (index: number) => {
    setOpenDates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

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
          // Initialize first date as open for mobile
          if (response.data.event.dates && response.data.event.dates.length > 1) {
            setOpenDates({ 0: true })
          }
        }
      }

      getEvento()
    } catch (error) {
      console.log("Erro ao buscar evento", error)
    }
  }, [id])

  if (!event || !id) {
    return (
      <LoadingPage></LoadingPage>
    )
  }

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Animated background */}
      {/* <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div> */}

      <Header isScrolled={true} />

      {/* Hero Section */}
      <div className="relative flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            backgroundImage: `url("${event?.image}")`,
            backgroundSize: "fit",
            backgroundPosition: "center",
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/100 via-black/50 to-black/70"></div>
        {/* <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/30 via-transparent to-blue-900/30"></div> */}

        {/* Floating Action Buttons */}
        <div className="absolute top-32 right-8 flex flex-col gap-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className={`rounded-2xl h-14 w-14 border transition-all duration-300 hover:scale-110 ${
              isFavorited
                ? "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400/50 shadow-lg shadow-red-500/25 text-white"
                : "bg-white/90 hover:bg-white border-white/50 text-gray-700 hover:text-gray-900 shadow-lg"
            }`}
          >
            <Heart className={`h-6 w-6 transition-all duration-300 ${isFavorited ? "fill-current scale-110" : ""}`} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer rounded-2xl h-14 w-14 bg-white/90 hover:bg-white border border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110 shadow-lg"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: event?.title || "Evento",
                  text: event?.description || "Confira este evento!",
                  url: window.location.href,
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
                alert("Link copiado para a área de transferência!")
              }
            }}
          >
            <Share2 className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl h-14 w-14 bg-white/90 hover:bg-white border border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Category Badge */}
            <div className="flex justify-center">
              <Badge className="px-6 py-2 text-sm font-semibold bg-gradient-to-r text-white border-0 rounded-full shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                {event?.category || "Evento Especial"}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white drop-shadow-2xl">{event?.title}</h1>

            {/* Event Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-white/50 text-gray-700 shadow-lg">
                <MapPin className="w-4 h-4 text-yellow-600" />
                <span>
                  {event?.city}, {event?.state}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-white/50 text-gray-700 shadow-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>
                  {event?.dates && event.dates.length > 0
                    ? new Date(event.dates[0].startDate).toLocaleDateString("pt-BR")
                    : "Data a definir"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-white/50 text-gray-700 shadow-lg">
                <Users className="w-4 h-4 text-amber-600" />
                <span>{event?.participants?.length || 0} participantes</span>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex justify-center">
              <a
                href={`/organizer/${event?.organizer._id}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/90 border border-white/50 hover:bg-white transition-all duration-300 hover:scale-105 group shadow-lg"
              >
                <Avatar className="h-12 w-12 border-2 border-yellow-400 group-hover:border-yellow-500 transition-colors">
                  <AvatarImage src={event?.organizer.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-blue-500 text-white">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-xs text-gray-600">Organizado por</p>
                  <p className="font-semibold text-gray-800 group-hover:text-yellow-700 transition-colors">
                    {event?.organizer.name}
                  </p>
                </div>
              </a>
            </div>

            {/* CTA Button */}
            <div className="pt-8 gap-3 flex flex-col items-center">
              {/* Scroll Indicator */}
              <div className="flex justify-center animate-bounce text-white">
                <ArrowDown />
              </div>
              <Button
                size="lg"
                className="px-12 py-6 text-lg w-full font-bold rounded-2xl bg-white hover:from-yellow-600 hover:via-blue-600 hover:to-amber-600 text-black hover:text-white cursor-pointer border-0 shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-[1.02]"
                onClick={() => {
                  const ticketSection = document.getElementById("tickets-section")
                  ticketSection?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                <Ticket className="w-6 h-6 mr-3" />
                {event?.isFree ? "Inscrever-se Gratuitamente" : "Garantir Ingresso"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribed Modal */}
      {subscribed && <Subscribed qrCode={qrCode} open={subscribed} onOpenChange={setSubscribed} />}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto lg:px-6 py-20 w-full">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <Card className="text-wrap border-0 bg-white/80 shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold flex items-center gap-4 text-gray-800">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                    <Globe className="w-6 h-6" />
                  </div>
                  Sobre o Evento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{event?.description}</p>

                {/* Mobile Event Info */}
                <div className="md:hidden mt-8 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <p className="text-sm font-medium text-gray-700">
                      {event?.neighborhood} | {event?.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <div className="text-sm text-gray-700">
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
                </div>
              </CardContent>
            </Card>

            {/* Lineup/Attractions Section - Mobile Optimized */}
          
            {event?.dates &&
              event.dates.length > 0 &&
              event.dates.some((date) => date.attractions && date.attractions.length > 0) && (
                <Card className="border-0 bg-white/80 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-3xl font-bold flex items-center gap-4 text-gray-800">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                        <Music className="w-6 h-6 text-black" />
                      </div>
                      Lineup & Atrações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {event.dates.length === 1 ? (
                      // Single date - Mobile optimized list
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl">
                          <Calendar className="h-6 w-6" />
                          <div>
                            <p className="font-bold text-gray-800 text-lg">
                              {new Date(event.dates[0].startDate).toLocaleDateString("pt-BR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-gray-600">
                              {event.dates[0].startTime} às {event.dates[0].endTime}
                            </p>
                          </div>
                        </div>

                        {/* Mobile: Vertical list instead of grid */}
                        <div className="space-y-4">
                          {(event.dates[0].attractions
                            ? [...event.dates[0].attractions].sort((a, b) => {
                                const aStart = (a as any).startTime || ""
                                const bStart = (b as any).startTime || ""
                                if (!aStart) return -1
                                if (!bStart) return 1
                                return aStart.localeCompare(bStart)
                              })
                            : []
                          ).map((attraction, index) => (
                            <div
                              key={index}
                              className="group p-4 rounded-xl bg-white border border-gray-200  hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
                              onClick={() => {
                                setSelectedAttraction(attraction)
                                setModalOpen(true)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-10 h-10 rounded-lg flex items-center border-2 border-black justify-center group-hover:scale-110 transition-transform">
                                    <Play className="h-5 w-5 text-black" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4
                                      className="font-bold text-gray-800 truncate max-w-[180px]"
                                      title={attraction.name}
                                    >
                                      {attraction.name}
                                    </h4>
                                    {attraction.startTime && (
                                      <p className="text-gray-600 text-sm">
                                        {attraction.startTime}
                                        {attraction.endTime && ` - ${attraction.endTime}`}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {attraction.social && (
                                    <a
                                      href={attraction.social}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  )}
                                  <ChevronRight className="h-5 w-5 text-black" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Multiple dates - Mobile accordion instead of tabs
                      <div className="space-y-4">
                        <div className="block md:hidden">
                          {/* Mobile: Accordion layout */}
                          {event.dates.map((date, index) => (
                            <Collapsible key={index} open={openDates[index]} onOpenChange={() => toggleDate(index)}>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="w-full p-4 h-auto justify-between rounded-xl border border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-200 mb-2"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center">
                                      <Calendar className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                      <p className="font-bold text-gray-800">
                                        {new Date(date.startDate).toLocaleDateString("pt-BR", {
                                          day: "2-digit",
                                          month: "short",
                                        })}
                                      </p>
                                      <p className="text-sm text-gray-600">{date.startTime}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {date.attractions?.length || 0} atrações
                                    </Badge>
                                    <ChevronDown
                                      className={`h-4 w-4 transition-transform ${openDates[index] ? "rotate-180" : ""}`}
                                    />
                                  </div>
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="space-y-3 mt-2 ml-4">
                                <div className="border-l-2 border-yellow-400 pl-4 space-y-3">
                                  {(date.attractions
                                    ? [...date.attractions].sort((a, b) => {
                                        const aStart = (a as any).startTime || ""
                                        const bStart = (b as any).startTime || ""
                                        if (!aStart) return -1
                                        if (!bStart) return 1
                                        return aStart.localeCompare(bStart)
                                      })
                                    : []
                                  ).map((attraction, attractionIndex) => (
                                    <div
                                      key={attractionIndex}
                                      className="group p-3 rounded-lg bg-white border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
                                      onClick={() => {
                                        setSelectedAttraction(attraction)
                                        setModalOpen(true)
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center">
                                            <Play className="h-4 w-4 text-white" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h5
                                              className="font-semibold text-gray-800 group-hover:text-yellow-700 transition-colors text-sm truncate max-w-[140px]"
                                              title={attraction.name}
                                            >
                                              {attraction.name}
                                            </h5>
                                            {attraction.startTime && (
                                              <p className="text-gray-600 text-xs">
                                                {attraction.startTime}
                                                {attraction.endTime && ` - ${attraction.endTime}`}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {attraction.social && (
                                            <a
                                              href={attraction.social}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="p-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <ExternalLink className="h-3 w-3" />
                                            </a>
                                          )}
                                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-yellow-600 transition-colors" />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>

                        {/* Desktop: Keep original tabs layout */}
                        <div className="hidden md:block">
                          <Tabs defaultValue="0" className="w-full">
                            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-auto p-2 bg-gray-100 rounded-2xl">
                              {event.dates.map((date, index) => (
                                <TabsTrigger
                                  key={index}
                                  value={index.toString()}
                                  className="flex flex-col items-center p-4 rounded-xl transition-all duration-200 hover:scale-105"
                                >
                                  <span className="font-bold text-lg">
                                    {new Date(date.startDate).toLocaleDateString("pt-BR", {
                                      day: "2-digit",
                                      month: "short",
                                    })}
                                  </span>
                                  <span className="text-xs opacity-80 mt-1">{date.startTime}</span>
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            {event.dates.map((date, index) => (
                              <TabsContent key={index} value={index.toString()} className="mt-8">
                                <div className="space-y-6">
                                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-blue-50">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                    <div>
                                      <p className="font-bold text-gray-800 text-lg">
                                        {new Date(date.startDate).toLocaleDateString("pt-BR", {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </p>
                                      <p className="text-gray-600">
                                        {date.startTime} às {date.endTime}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(date.attractions
                                      ? [...date.attractions].sort((a, b) => {
                                          const aStart = (a as any).startTime || ""
                                          const bStart = (b as any).startTime || ""
                                          if (!aStart) return -1
                                          if (!bStart) return 1
                                          return aStart.localeCompare(bStart)
                                        })
                                      : []
                                    ).map((attraction, attractionIndex) => (
                                      <div
                                        key={attractionIndex}
                                        className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                                        onClick={() => {
                                          setSelectedAttraction(attraction)
                                          setModalOpen(true)
                                        }}
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Play className="h-6 w-6 text-black" />
                                          </div>
                                          <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 text-lg group-hover:text-yellow-700 transition-colors">
                                              {attraction.name}
                                            </h4>
                                            {attraction.startTime && (
                                              <p className="text-gray-600 text-sm mt-1">
                                                {attraction.startTime}
                                                {attraction.endTime && ` - ${attraction.endTime}`}
                                              </p>
                                            )}
                                            {attraction.social && (
                                              <a
                                                href={attraction.social}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
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
                                </div>
                              </TabsContent>
                            ))}
                          </Tabs>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
           
            {/* Event Policy */}
            <Card className="border-0 bg-white/80 shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-4 text-gray-800">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 text-black" />
                  </div>
                  Política do Evento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{visibleText}</p>
                {policy.length > 150 && (
                  <Button
                    variant="ghost"
                    onClick={togglePolicy}
                    className="mt-6 p-0 h-auto text-blue-600 hover:text-yellow-600 font-medium transition-colors"
                  >
                    {showFull ? (
                      <>
                        Ver menos <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Ver mais <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-0 bg-white/80 shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl flex-col sm:flex-row font-bold flex items-center gap-4 text-gray-800">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 text-black" />
                  </div>
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-start p-6 rounded-2xl">
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl mb-3">{event?.venueName || "Local do evento"}</h3>
                    <p className="text-gray-700 mb-2">
                      {event?.street && `${event.street}`}
                      {event?.number && `, ${event.number}`}
                      {event?.complement && ` - ${event.complement}`}
                    </p>
                    <p className="text-gray-700">
                      {event?.neighborhood && `${event.neighborhood}`}
                      {event?.city && `, ${event.city}`}
                      {event?.state && ` - ${event.state}`}
                      {event?.zipCode && ` (${event.zipCode})`}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
                  <iframe
                    src={
                      event?.mapUrl ||
                      (event?.latitude && event?.longitude
                        ? `https://www.google.com/maps/embed/v1/place?key=${
                            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                          }&q=${event.latitude},${event.longitude}&zoom=15`
                        : "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1963.4955007216295!2d-48.337388507953854!3d-10.181385600694082!3m2!1i1024!2i768!4f13.1!3m3!1m2!1spt-BR!2sbr!4v1749832543882!5m2!1spt-BR!2sbr")
                    }
                    width="100%"
                    height="400"
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
          <div className="space-y-8" id="tickets-section">
            <Card className="border-0 bg-white/90 shadow-2xl sticky top-8 hover:shadow-blue-500/20 transition-all duration-300">
              <CardHeader className="">
                <CardTitle className="text-2xl font-bold flex items-center gap-4 text-gray-800">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  {event?.isFree
                    ? event.formTitle || "Formulário de Inscrição"
                    : `Ingressos ${event.batches[0]?.batchName || ""}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event?.isFree ? (
                  <div className="space-y-8 w-full">                    
                    <FreeEventForm
                      customFields={event?.customFields ?? []}
                      eventId={event._id}
                      setSubscribed={setSubscribed}
                      setQrCode={setQrCode}
                    />
                  </div>
                ) : (
                  <div>
                    {!event.batches || event.batches.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center mx-auto mb-6">
                          <Ticket className="h-12 w-12 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Ingressos Indisponíveis</h3>
                        <p className="text-gray-600">Este evento não está disponível no momento.</p>
                      </div>
                    ) : event.currentTickets && event.currentTickets.length > 0 ? (
                      <TicketSelector event={event} tickets={event.currentTickets} />
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center mx-auto mb-6">
                          <Clock className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Em Breve</h3>
                        <p className="text-gray-600 mb-6">Os ingressos serão disponibilizados em breve.</p>
                        <Button className="bg-gradient-to-r from-yellow-500 to-blue-500 hover:from-yellow-600 hover:to-blue-600 text-white border-0 rounded-xl px-6 py-3">
                          Notificar-me
                        </Button>
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

      {/* Attraction Modal */}
      {selectedAttraction && (
        <AttractionModal open={modalOpen} onOpenChange={setModalOpen} attraction={selectedAttraction} />
      )}
    </div>
  )
}

export default EventDetail
