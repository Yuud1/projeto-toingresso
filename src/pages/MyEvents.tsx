import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Eye, Search, Users, Calendar, Ticket, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Avatar } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  status: "ativos" | "encerrados" | "rascunhos"
  ticketsSold?: number
  totalTickets?: number
  revenue?: number
}

interface Sale {
  name: string
  email: string
  value: number
  avatar?: string
}

interface TabProps {
  isActive: boolean
  children: React.ReactNode
  onClick: () => void
  className?: string
}

const Tab = ({ isActive, children, onClick, className }: TabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors relative",
        isActive
          ? "text-[#02488C]"
          : "text-gray-500 hover:text-gray-700",
        className
      )}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#02488C]" />
      )}
    </button>
  )
}

// Dados de exemplo para teste
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Show de Rock",
    date: "2024-01-15",
    location: "Arena Show",
    description: "Um show incrível de rock",
    status: "ativos",
    ticketsSold: 150,
    totalTickets: 200,
    revenue: 6000
  },
  {
    id: "2",
    title: "Festival de Música",
    date: "2024-03-20",
    location: "Parque da Cidade",
    description: "Festival com várias bandas",
    status: "encerrados",
    ticketsSold: 500,
    totalTickets: 500,
    revenue: 4500
  },
  {
    id: "3",
    title: "Teatro",
    date: "2024-05-10",
    location: "Teatro Municipal",
    description: "Peça teatral",
    status: "rascunhos",
    ticketsSold: 0,
    totalTickets: 100,
    revenue: 0
  },
  {
    id: "4",
    title: "Feira de Tecnologia",
    date: "2024-08-05",
    location: "Centro de Convenções",
    description: "Evento de tecnologia",
    status: "ativos",
    ticketsSold: 300,
    totalTickets: 400,
    revenue: 5000
  },
  {
    id: "5",
    title: "Workshop de Design",
    date: "2024-12-12",
    location: "Espaço Criativo",
    description: "Workshop prático",
    status: "encerrados",
    ticketsSold: 100,
    totalTickets: 120,
    revenue: 4800
  }
]

const sales: Sale[] = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", value: 1999, avatar: undefined },
  { name: "Jackson Lee", email: "jackson.lee@email.com", value: 39, avatar: undefined },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", value: 299, avatar: undefined },
  { name: "William Kim", email: "will@email.com", value: 99, avatar: undefined },
  { name: "Sofia Davis", email: "sofia.davis@email.com", value: 39, avatar: undefined },
]

// Gerar dados de receita por mês
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const revenueData = months.map((month, idx) => {
  // Soma a receita dos eventos daquele mês
  const monthRevenue = mockEvents
    .filter(e => new Date(e.date).getMonth() === idx)
    .reduce((acc, e) => acc + (e.revenue || 0), 0)
  return { name: month, revenue: monthRevenue }
})

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [mainTab, setMainTab] = useState<"inicio" | "dashboard">("inicio")
  const [subTab, setSubTab] = useState<"ativos" | "encerrados" | "rascunhos">("ativos")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEvents = events.filter(event => {
    const matchesTab = event.status === subTab
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesTab && matchesSearch
  })

  const dashboardMetrics = {
    totalEvents: events.length,
    activeEvents: events.filter(e => e.status === "ativos").length,
    totalRevenue: events.reduce((acc, event) => acc + (event.revenue || 0), 0),
    totalTicketsSold: events.reduce((acc, event) => acc + (event.ticketsSold || 0), 0),
    upcomingEvents: events.filter(e => new Date(e.date) > new Date() && e.status === "ativos").length
  }

  const handleEdit = (eventId: string) => {
    // Implementar lógica de edição
    console.log("Editar evento:", eventId)
  }

  const handleDelete = (eventId: string) => {
    // Implementar lógica de exclusão
    console.log("Excluir evento:", eventId)
  }

  const handleView = (eventId: string) => {
    // Implementar lógica de visualização
    console.log("Visualizar evento:", eventId)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isScrolled={true} />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Meus Eventos</h1>
            <div className="flex space-x-4">
              <Tab
                isActive={mainTab === "inicio"}
                onClick={() => setMainTab("inicio")}
                className="text-base"
              >
                Início
              </Tab>
              <Tab
                isActive={mainTab === "dashboard"}
                onClick={() => setMainTab("dashboard")}
                className="text-base"
              >
                Dashboard
              </Tab>
            </div>
          </div>

          {mainTab === "inicio" && (
            <>
              <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-auto order-2 sm:order-1 flex space-x-6">
                  <Tab
                    isActive={subTab === "ativos"}
                    onClick={() => setSubTab("ativos")}
                  >
                    Ativos
                  </Tab>
                  <Tab
                    isActive={subTab === "encerrados"}
                    onClick={() => setSubTab("encerrados")}
                  >
                    Encerrados
                  </Tab>
                  <Tab
                    isActive={subTab === "rascunhos"}
                    onClick={() => setSubTab("rascunhos")}
                  >
                    Rascunhos
                  </Tab>
                </div>
                <div className="relative w-full sm:w-64 order-1 sm:order-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Buscar eventos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-600 mb-4">Não há eventos {subTab}</p>
                  <Button 
                    onClick={() => window.location.href = "/criar-evento"}
                    className="bg-[#02488C] hover:bg-[#02488C]/90"
                  >
                    CRIAR EVENTO
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                        <CardDescription>{new Date(event.date).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-4">{event.location}</p>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleView(event.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleEdit(event.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(event.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {mainTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardMetrics.totalEvents}</div>
                    <p className="text-xs text-muted-foreground">
                      {dashboardMetrics.activeEvents} eventos ativos
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingressos Vendidos</CardTitle>
                    <Ticket className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardMetrics.totalTicketsSold}</div>
                    <p className="text-xs text-muted-foreground">
                      Em todos os eventos
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {dashboardMetrics.totalRevenue.toLocaleString('pt-BR')}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Em todos os eventos
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardMetrics.upcomingEvents}</div>
                    <p className="text-xs text-muted-foreground">
                      Eventos futuros
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>Receita por mês</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={revenueData} style={{ fontSize: 12 }}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} dy={8} />
                        <YAxis axisLine={false} tickLine={false} width={60} tickFormatter={v => `R$${v}`} />
                        <Bar dataKey="revenue" fill="#222" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>Você fez {sales.length} vendas este mês.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sales.map((sale, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar alt={sale.name} src={sale.avatar} />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{sale.name}</span>
                              <span className="text-xs text-gray-500">{sale.email}</span>
                            </div>
                          </div>
                          <span className="font-semibold text-sm">+R${sale.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}