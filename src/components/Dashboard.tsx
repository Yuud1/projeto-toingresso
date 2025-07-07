import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Ticket,
  TrendingUp,
  Award,
  UserCheck,
  EyeOff,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type EventInterface from "@/interfaces/EventInterface";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  events: EventInterface[];
  hideValues: boolean;
  setHideValues: (value: boolean) => void;
  selectedDashboardEvent: string | undefined;
  setSelectedDashboardEvent: (value: string | undefined) => void;
  dashboardMetrics: {
    totalTicketsSold: number;
    upcomingEvents: number;
    totalEvents: number;
    totalRevenue: number;
    checkinsCount: number;
    certificateCount: number;
  };
  revenueData: Array<{
    name: string;
    revenue: number;
  }>;
}

const Dashboard: React.FC<DashboardProps> = ({
  events,
  hideValues,
  setHideValues,
  selectedDashboardEvent,
  setSelectedDashboardEvent,
  dashboardMetrics,
  revenueData,
}) => {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return hideValues ? "***" : `R$ ${value.toLocaleString("pt-BR")}`;
  };

  const formatNumber = (value: number) => {
    return hideValues ? "***" : value.toLocaleString("pt-BR");
  };

  const handleCheckinsClick = () => {
    if (selectedDashboardEvent && selectedDashboardEvent !== "all") {
      navigate(`/event-arrivals/${selectedDashboardEvent}`);
    }
    // Se nenhum evento específico estiver selecionado, não faz nada
  };

  const isCheckinsCardClickable =
    selectedDashboardEvent && selectedDashboardEvent !== "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Mobile: Botão quadrado ao lado do dropdown */}
        <div className="flex items-center gap-2 w-full lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHideValues(!hideValues)}
            className="w-10 h-10 p-0 rounded-lg flex-shrink-0"
            title={hideValues ? "Mostrar Valores" : "Ocultar Valores"}
          >
            <EyeOff className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <Select
              value={selectedDashboardEvent}
              onValueChange={setSelectedDashboardEvent}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecionar evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os eventos</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop: Layout original */}
        <div className="hidden lg:flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHideValues(!hideValues)}
            className="flex-1 sm:flex-none"
          >
            <EyeOff className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">
              {hideValues ? "Mostrar" : "Ocultar"} Valores
            </span>
          </Button>
        </div>

        <div className="hidden lg:block w-full lg:w-auto lg:min-w-[250px]">
          <div className="flex-1">
            <Select
              value={selectedDashboardEvent}
              onValueChange={setSelectedDashboardEvent}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecionar evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os eventos</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingressos Vendidos
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardMetrics.totalTicketsSold)}
            </div>
            <p className="text-xs text-muted-foreground">Vendas no total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingressos Restantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(
                dashboardMetrics.upcomingEvents -
                  dashboardMetrics.totalTicketsSold
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingressos disponíveis
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingressos Cancelados
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardMetrics.totalEvents)}
            </div>
            <p className="text-xs text-muted-foreground">Cancelados no total</p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardMetrics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Neste evento</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          className={`transition-all duration-200 ${
            isCheckinsCardClickable
              ? "cursor-pointer hover:shadow-md hover:scale-[1.02]"
              : "cursor-default opacity-60"
          }`}
          onClick={isCheckinsCardClickable ? handleCheckinsClick : undefined}
          title={
            isCheckinsCardClickable
              ? "Clique para ver check-ins"
              : "Selecione um evento específico para ver check-ins"
          }
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Check-ins Realizados
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardMetrics.checkinsCount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isCheckinsCardClickable
                ? "Pessoas que validaram ingresso"
                : "Selecione um evento para ver check-ins"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certificados Gerados
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardMetrics.certificateCount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de certificados
            </p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Participantes Únicos
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(dashboardMetrics.checkinsCount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Pessoas diferentes
            </p>
          </CardContent>
        </Card> */}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Receita por mês{" "}
              {selectedDashboardEvent &&
                `- ${
                  events.find((e) => e._id === selectedDashboardEvent)?.title
                }`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] sm:h-[300px] lg:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} style={{ fontSize: 12 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                    fontSize={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={60}
                    fontSize={10}
                    tickFormatter={(v) => (hideValues ? "***" : `R$${v}`)}
                  />
                  <Bar dataKey="revenue" fill="#222" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
