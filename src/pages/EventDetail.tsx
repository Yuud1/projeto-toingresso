"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TicketSelector } from "@/components/TicketSelector";
import FreeEventForm from "@/components/FreeEventForm";
import Subscribed from "@/pages/Subscribed";
import { useUser } from "@/contexts/useContext";
import type EventInterface from "@/interfaces/EventInterface";
import AttractionModal from "@/components/AttractionModal";

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useUser();

  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [event, setEvents] = useState<EventInterface | undefined>(undefined);
  const [subscribed, setSubscribed] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showFull, setShowFull] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<any | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const condition =
      user?.likedEvents.some((e) => e.toString() == id) ?? false;
    setIsFavorited(condition);
  }, [user]);

  async function handleFavorite() {
    setIsFavorited(!isFavorited);

    if (!isFavorited) {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_USER_LIKE_EVENT
        }/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } else {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_USER_REMOVE_LIKE_EVENT
        }/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    }
  }

  const togglePolicy = () => setShowFull((prev) => !prev);
  const policy = event?.policy || "";
  const visibleText = showFull ? policy : `${policy.slice(0, 150)}...`;

  useEffect(() => {
    try {
      async function getEvento() {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${
            import.meta.env.VITE_EVENT_GETID
          }${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.event) {
          setEvents(response.data.event);
        }
      }

      getEvento();
    } catch (error) {
      console.log("Erro ao buscar evento", error);
    }
  }, [id]);

  if (!event || !id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-blue-50 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-yellow-400 via-blue-500 to-amber-400 mx-auto mb-8 p-1">
              <div className="rounded-full h-full w-full bg-white"></div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-blue-500 to-amber-400 blur-xl opacity-30 animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Carregando experiência
          </h2>
          <p className="text-gray-600">Preparando algo incrível para você...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/50 via-white to-blue-50/50 text-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header isScrolled={true} />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 scale-110 transition-transform duration-500 ease-out"
          style={{
            backgroundImage: `url("${event?.image}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/30 via-transparent to-blue-900/30"></div>

        {/* Floating Action Buttons */}
        <div className="absolute top-32 right-8 flex flex-col gap-4 z-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavorite}
            className={`rounded-2xl h-14 w-14 border transition-all duration-500 hover:scale-110 ${
              isFavorited
                ? "bg-gradient-to-r from-red-500/90 to-pink-500/90 border-red-400/50 shadow-lg shadow-red-500/25 text-white"
                : "bg-white/90 hover:bg-white border-white/50 text-gray-700 hover:text-gray-900 shadow-lg"
            }`}
          >
            <Heart
              className={`h-6 w-6 transition-all duration-300 ${
                isFavorited ? "fill-current scale-110" : ""
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer rounded-2xl h-14 w-14  bg-white/90 hover:bg-white border border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110 shadow-lg"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: event?.title || "Evento",
                  text: event?.description || "Confira este evento!",
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copiado para a área de transferência!");
              }
            }}
          >
            <Share2 className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-2xl h-14 w-14  bg-white/90 hover:bg-white border border-white/50 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-110 shadow-lg"
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
            <h1 className="text-5xl md:text-7xl font-black leading-tight text-white drop-shadow-2xl">
              {event?.title}
            </h1>

            {/* Event Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-white/50 text-gray-700 shadow-lg">
                <MapPin className="w-4 h-4 text-yellow-600" />
                <span>
                  {event?.city}, {event?.state}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90  border border-white/50 text-gray-700 shadow-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>
                  {event?.dates && event.dates.length > 0
                    ? new Date(event.dates[0].startDate).toLocaleDateString(
                        "pt-BR"
                      )
                    : "Data a definir"}
                </span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90  border border-white/50 text-gray-700 shadow-lg">
                <Users className="w-4 h-4 text-amber-600" />
                <span>{event?.participants?.length || 0} participantes</span>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex justify-center">
              <a
                href={`/organizer/${event?.organizer._id}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/90  border border-white/50 hover:bg-white transition-all duration-300 hover:scale-105 group shadow-lg"
              >
                <Avatar className="h-12 w-12 border-2 border-yellow-400 group-hover:border-yellow-500 transition-colors">
                  <AvatarImage
                    src={event?.organizer.avatar || "/placeholder.svg"}
                  />
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
                  const ticketSection =
                    document.getElementById("tickets-section");
                  ticketSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Ticket className="w-6 h-6 mr-3" />
                {event?.isFree
                  ? "Inscrever-se Gratuitamente"
                  : "Garantir Ingresso"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribed Modal */}
      {subscribed && (
        <Subscribed
          qrCode={qrCode}
          open={subscribed}
          onOpenChange={setSubscribed}
        />
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <Card className="text-wrap border-0 bg-white/80  shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 hover:scale-[1.02]">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl font-bold flex items-center gap-4 text-gray-800">
                  <div className="w-12 h-12 rounded-2xl  flex items-center justify-center">
                    <Globe className="w-6 h-6 " />
                  </div>
                  Sobre o Evento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {event?.description}
                </p>

                {/* Mobile Event Info */}
                <div className="md:hidden mt-8 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 " />
                    <p className="text-sm font-medium text-gray-700">
                      {event?.neighborhood} | {event?.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 " />
                    <div className="text-sm text-gray-700">
                      {event?.dates && event.dates.length > 0 ? (
                        event.dates.map((period, i) => (
                          <div key={i}>
                            {new Date(period.startDate).toLocaleDateString()}{" "}
                            {period.startTime} até{" "}
                            {new Date(period.endDate).toLocaleDateString()}{" "}
                            {period.endTime}
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

            {/* Lineup/Attractions Section */}
            {event?.dates &&
              event.dates.length > 0 &&
              event.dates.some(
                (date) => date.attractions && date.attractions.length > 0
              ) && (
                <Card className="border-0 bg-white/80  shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-3xl font-bold flex items-center gap-4 text-gray-800">
                      <div className="w-12 h-12 rounded-2xl  flex items-center justify-center">
                        <Music className="w-6 h-6 text-black" />
                      </div>
                      Lineup & Atrações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {event.dates.length === 1 ? (
                      // Single date
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl ">
                          <Calendar className="h-6 w-6 " />
                          <div>
                            <p className="font-bold text-gray-800 text-lg">
                              {new Date(
                                event.dates[0].startDate
                              ).toLocaleDateString("pt-BR", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-gray-600">
                              {event.dates[0].startTime} às{" "}
                              {event.dates[0].endTime}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(event.dates[0].attractions
                            ? [...event.dates[0].attractions].sort((a, b) => {
                                const aStart = (a as any).startTime || "";
                                const bStart = (b as any).startTime || "";
                                if (!aStart) return -1;
                                if (!bStart) return 1;
                                return aStart.localeCompare(bStart);
                              })
                            : []
                          ).map((attraction, index) => (
                            <div
                              key={index}
                              className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                              onClick={() => {
                                setSelectedAttraction(attraction);
                                setModalOpen(true);
                              }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl  flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Play className="h-6 w-6 text-black" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-800 text-lg group-hover:text-yellow-700 transition-colors">
                                    {attraction.name}
                                  </h4>
                                  {attraction.startTime && (
                                    <p className="text-gray-600 text-sm mt-1">
                                      {attraction.startTime}
                                      {attraction.endTime &&
                                        ` - ${attraction.endTime}`}
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
                    ) : (
                      // Multiple dates with tabs
                      <Tabs defaultValue="0" className="w-full">
                        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-auto p-2 bg-gray-100 rounded-2xl">
                          {event.dates.map((date, index) => (
                            <TabsTrigger
                              key={index}
                              value={index.toString()}
                              className="flex flex-col items-center p-4  rounded-xl transition-all duration-200 hover:scale-105"
                            >
                              <span className="font-bold text-lg">
                                {new Date(date.startDate).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                  }
                                )}
                              </span>
                              <span className="text-xs opacity-80 mt-1">
                                {date.startTime}
                              </span>
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {event.dates.map((date, index) => (
                          <TabsContent
                            key={index}
                            value={index.toString()}
                            className="mt-8"
                          >
                            <div className="space-y-6">
                              <div className="flex items-center gap-4 p-4 rounded-2xl ">
                                <Calendar className="h-6 w-6 " />
                                <div>
                                  <p className="font-bold text-gray-800 text-lg">
                                    {new Date(
                                      date.startDate
                                    ).toLocaleDateString("pt-BR", {
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
                                      const aStart = (a as any).startTime || "";
                                      const bStart = (b as any).startTime || "";
                                      if (!aStart) return -1;
                                      if (!bStart) return 1;
                                      return aStart.localeCompare(bStart);
                                    })
                                  : []
                                ).map((attraction, attractionIndex) => (
                                  <div
                                    key={attractionIndex}
                                    className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                                    onClick={() => {
                                      setSelectedAttraction(attraction);
                                      setModalOpen(true);
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
                                            {attraction.endTime &&
                                              ` - ${attraction.endTime}`}
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
                    )}
                  </CardContent>
                </Card>
              )}

            {/* Event Policy */}
            <Card className="border-0 bg-white/80  shadow-2xl hover:shadow-amber-500/10 transition-all duration-500">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-4 text-gray-800">
                  <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
                    <Star className="w-5 h-5 text-black" />
                  </div>
                  Política do Evento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {visibleText}
                </p>
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
            <Card className="border-0 bg-white/80  shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500">
              <CardHeader className="pb-6">
                <CardTitle className="text-3xl flex-col sm:flex-row font-bold flex items-center gap-4 text-gray-800">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 text-black" />
                  </div>
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 p-6 rounded-2xl">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-8 w-8 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl mb-3">
                      {event?.venueName || "Local do evento"}
                    </h3>
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

                <div className="rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 transform hover:scale-[1.02] border-2 border-gray-200 hover:border-yellow-400">
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
            <Card className="border-0 bg-white/90  shadow-2xl sticky top-8 hover:shadow-blue-500/20 transition-all duration-500">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold flex items-center gap-4 text-gray-800">
                  <div className="w-12 h-12 rounded-2xl  flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  {event?.isFree
                    ? event.formTitle || "Inscrição Gratuita"
                    : `Ingressos ${event.batches[0]?.batchName || ""}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {event?.isFree ? (
                  <div className="space-y-8 w-full">
                    <div className="text-center py-6">
                      <Badge className="text-lg px-8 py-4 text-white border-0 shadow-lg shadow-black-500/25 rounded-2xl">
                        <Sparkles className="w-5 h-5 mr-2" />
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
                    {!event.batches || event.batches.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center mx-auto mb-6">
                          <Ticket className="h-12 w-12 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          Ingressos Indisponíveis
                        </h3>
                        <p className="text-gray-600">
                          Este evento não está disponível no momento.
                        </p>
                      </div>
                    ) : event.currentTickets &&
                      event.currentTickets.length > 0 ? (
                      <TicketSelector
                        event={event}
                        tickets={event.currentTickets}
                      />
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-yellow-400 to-blue-500 flex items-center justify-center mx-auto mb-6">
                          <Clock className="h-12 w-12 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          Em Breve
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Os ingressos serão disponibilizados em breve.
                        </p>
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
        <AttractionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          attraction={selectedAttraction}
        />
      )}
    </div>
  );
};

export default EventDetail;
