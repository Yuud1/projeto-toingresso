import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Settings, Eye, Clock, MapPin, Mail, Phone, Calendar, TrendingUp } from "lucide-react"

interface Subscriber {
  id: string
  name: string
  email: string
  phone?: string
  registeredAt: Date
  status: "confirmed" | "pending" | "cancelled"
  ticketType: string
  location?: string
  avatar?: string
}

interface DisplayConfig {
  showEmail: boolean
  showPhone: boolean
  showLocation: boolean
  showRegistrationTime: boolean
  showTicketType: boolean
  showAvatar: boolean
  layout: "grid" | "list"
  refreshInterval: number
}

export default function EventDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [config, setConfig] = useState<DisplayConfig>({
    showEmail: true,
    showPhone: false,
    showLocation: true,
    showRegistrationTime: true,
    showTicketType: true,
    showAvatar: true,
    layout: "grid",
    refreshInterval: 5000,
  })
  const [totalSubscribers, setTotalSubscribers] = useState(0)
  const [todaySubscribers, setTodaySubscribers] = useState(0)

  // Simular dados iniciais
  useEffect(() => {
    const initialData: Subscriber[] = [
      {
        id: "1",
        name: "Ana Silva",
        email: "ana.silva@email.com",
        phone: "+55 11 99999-9999",
        registeredAt: new Date(Date.now() - 3600000),
        status: "confirmed",
        ticketType: "VIP",
        location: "São Paulo, SP",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: "2",
        name: "Carlos Santos",
        email: "carlos.santos@email.com",
        phone: "+55 21 88888-8888",
        registeredAt: new Date(Date.now() - 7200000),
        status: "confirmed",
        ticketType: "Premium",
        location: "Rio de Janeiro, RJ",
      },
      {
        id: "3",
        name: "Maria Oliveira",
        email: "maria.oliveira@email.com",
        registeredAt: new Date(Date.now() - 1800000),
        status: "pending",
        ticketType: "Standard",
        location: "Belo Horizonte, MG",
      },
    ]

    setSubscribers(initialData)
    setTotalSubscribers(initialData.length)
    setTodaySubscribers(initialData.filter((s) => s.registeredAt.toDateString() === new Date().toDateString()).length)
  }, [])

  // Simular WebSocket - adicionar novos inscritos
  useEffect(() => {
    const interval = setInterval(() => {
      const names = [
        "João Pedro",
        "Fernanda Costa",
        "Ricardo Lima",
        "Juliana Rocha",
        "Pedro Henrique",
        "Camila Ferreira",
      ]
      const cities = [
        "São Paulo, SP",
        "Rio de Janeiro, RJ",
        "Belo Horizonte, MG",
        "Salvador, BA",
        "Fortaleza, CE",
        "Brasília, DF",
      ]
      const tickets = ["Standard", "Premium", "VIP"]

      const randomName = names[Math.floor(Math.random() * names.length)]
      const randomCity = cities[Math.floor(Math.random() * cities.length)]
      const randomTicket = tickets[Math.floor(Math.random() * tickets.length)]

      const newSubscriber: Subscriber = {
        id: Date.now().toString(),
        name: randomName,
        email: `${randomName.toLowerCase().replace(" ", ".")}@email.com`,
        phone: `+55 11 ${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`,
        registeredAt: new Date(),
        status: Math.random() > 0.1 ? "confirmed" : "pending",
        ticketType: randomTicket,
        location: randomCity,
      }

      setSubscribers((prev) => [newSubscriber, ...prev])
      setTotalSubscribers((prev) => prev + 1)
      setTodaySubscribers((prev) => prev + 1)
    }, config.refreshInterval)

    return () => clearInterval(interval)
  }, [config.refreshInterval])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTicketColor = (ticket: string) => {
    switch (ticket) {
      case "VIP":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Premium":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Standard":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const SubscriberCard = ({ subscriber }: { subscriber: Subscriber }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {config.showAvatar && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={subscriber.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {subscriber.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-sm truncate">{subscriber.name}</h3>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(subscriber.status)}`} />
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              {config.showEmail && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{subscriber.email}</span>
                </div>
              )}

              {config.showPhone && subscriber.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{subscriber.phone}</span>
                </div>
              )}

              {config.showLocation && subscriber.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{subscriber.location}</span>
                </div>
              )}

              {config.showRegistrationTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(subscriber.registeredAt)}</span>
                </div>
              )}
            </div>

            {config.showTicketType && (
              <Badge variant="outline" className={`mt-2 text-xs ${getTicketColor(subscriber.ticketType)}`}>
                {subscriber.ticketType}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const SubscriberListItem = ({ subscriber }: { subscriber: Subscriber }) => (
    <div className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors">
      {config.showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={subscriber.avatar || "/placeholder.svg"} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            {subscriber.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{subscriber.name}</span>
          <div className={`w-2 h-2 rounded-full ${getStatusColor(subscriber.status)}`} />
        </div>

        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
          {config.showEmail && <span className="truncate">{subscriber.email}</span>}
          {config.showLocation && subscriber.location && <span>{subscriber.location}</span>}
          {config.showRegistrationTime && <span>{formatTime(subscriber.registeredAt)}</span>}
        </div>
      </div>

      {config.showTicketType && (
        <Badge variant="outline" className={`text-xs ${getTicketColor(subscriber.ticketType)}`}>
          {subscriber.ticketType}
        </Badge>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard do Evento</h1>
            <p className="text-slate-600 mt-1">Acompanhe as inscrições em tempo real</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-green-500 animate-pulse`} />
              <span className="text-sm font-medium">AO VIVO</span>
            </div>

            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/dashboard")}>
              <Eye className="h-4 w-4 mr-2" />
              Sair
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurações
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Configurações de Exibição</SheetTitle>
                  <SheetDescription>Personalize quais informações dos inscritos serão exibidas</SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-medium mb-3">Campos a Exibir</h3>
                    <div className="space-y-3">
                      {[
                        { key: "showAvatar", label: "Avatar" },
                        { key: "showEmail", label: "E-mail" },
                        { key: "showPhone", label: "Telefone" },
                        { key: "showLocation", label: "Localização" },
                        { key: "showRegistrationTime", label: "Horário de Inscrição" },
                        { key: "showTicketType", label: "Tipo de Ingresso" },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={key}>{label}</Label>
                          <Switch
                            id={key}
                            checked={config[key as keyof DisplayConfig] as boolean}
                            onCheckedChange={(checked) => setConfig((prev) => ({ ...prev, [key]: checked }))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Layout</h3>
                    <Select
                      value={config.layout}
                      onValueChange={(value: "grid" | "list") => setConfig((prev) => ({ ...prev, layout: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grade</SelectItem>
                        <SelectItem value="list">Lista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Intervalo de Atualização</h3>
                    <Select
                      value={config.refreshInterval.toString()}
                      onValueChange={(value) =>
                        setConfig((prev) => ({ ...prev, refreshInterval: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">1 segundo</SelectItem>
                        <SelectItem value="3000">3 segundos</SelectItem>
                        <SelectItem value="5000">5 segundos</SelectItem>
                        <SelectItem value="10000">10 segundos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Inscritos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSubscribers}</div>
              <p className="text-xs text-muted-foreground">+{todaySubscribers} hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscrições Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todaySubscribers}</div>
              <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Confirmação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((subscribers.filter((s) => s.status === "confirmed").length / subscribers.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {subscribers.filter((s) => s.status === "confirmed").length} confirmados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Inscritos Recentes
              <Badge variant="secondary" className="ml-auto">
                {subscribers.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {config.layout === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {subscribers.map((subscriber) => (
                  <SubscriberCard key={subscriber.id} subscriber={subscriber} />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {subscribers.map((subscriber) => (
                  <SubscriberListItem key={subscriber.id} subscriber={subscriber} />
                ))}
              </div>
            )}

            {subscribers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum inscrito ainda</p>
                <p className="text-sm">Os inscritos aparecerão aqui em tempo real</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
