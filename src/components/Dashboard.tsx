import React, { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BarChart as ReBarChart, Bar as ReBar, XAxis as ReXAxis, YAxis as ReYAxis, Tooltip as ReTooltip, ResponsiveContainer as ReResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer as PieResponsiveContainer } from "recharts";

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

  // Estado para modal de relatório de ingressos vendidos
  const [openTicketsModal, setOpenTicketsModal] = useState(false);

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

  // Função para obter os eventos filtrados
  const getFilteredEvents = () => {
    if (!selectedDashboardEvent || selectedDashboardEvent === "all") {
      return events;
    }
    return events.filter((event) => event._id === selectedDashboardEvent);
  };

  // Dados para gráfico de barras de ingressos vendidos por lote
  const ticketsBarData = React.useMemo(() => {
    const filtered = getFilteredEvents();
    const data: Array<{ lote: string; vendidos: number; evento: string }> = [];
    filtered.forEach(event => {
      event.batches.forEach(batch => {
        const vendidos = batch.tickets.reduce((acc, t) => acc + t.soldQuantity, 0);
        data.push({ lote: batch.batchName, vendidos, evento: event.title });
      });
    });
    return data;
  }, [events, selectedDashboardEvent]);

  // Cálculo: Receita bruta, líquida, preço médio, taxa de ocupação
  const { receitaBruta, receitaLiquida, totalIngressosVendidos, totalIngressosDisponiveis, precoMedio, taxaOcupacao } = React.useMemo(() => {
    let receitaBruta = 0;
    let receitaLiquida = 0;
    let totalIngressosVendidos = 0;
    let totalIngressosDisponiveis = 0;
    let somaPrecoQtd = 0;
    let taxaOcupacao = 0;
    const taxa = 0.1; // 10%
    getFilteredEvents().forEach(event => {
      event.batches.forEach(batch => {
        batch.tickets.forEach(ticket => {
          receitaBruta += ticket.soldQuantity * ticket.price;
          receitaLiquida += ticket.soldQuantity * ticket.price * (1 - taxa);
          totalIngressosVendidos += ticket.soldQuantity;
          totalIngressosDisponiveis += ticket.quantity;
          somaPrecoQtd += ticket.soldQuantity * ticket.price;
        });
      });
    });
    taxaOcupacao = totalIngressosDisponiveis > 0 ? (totalIngressosVendidos / totalIngressosDisponiveis) * 100 : 0;
    const precoMedio = totalIngressosVendidos > 0 ? somaPrecoQtd / totalIngressosVendidos : 0;
    return { receitaBruta, receitaLiquida, totalIngressosVendidos, totalIngressosDisponiveis, precoMedio, taxaOcupacao };
  }, [events, selectedDashboardEvent]);

  // Cálculo: Proporção de tipos de ingresso vendidos
  const proporcaoTiposIngresso = React.useMemo(() => {
    const tipos: { [key: string]: number } = {};
    let totalVendidos = 0;
    getFilteredEvents().forEach(event => {
      event.batches.forEach(batch => {
        batch.tickets.forEach(ticket => {
          const tipo = ticket.name;
          tipos[tipo] = (tipos[tipo] || 0) + ticket.soldQuantity;
          totalVendidos += ticket.soldQuantity;
        });
      });
    });
    return Object.entries(tipos).map(([tipo, vendidos]) => ({
      name: tipo,
      value: vendidos,
      percentage: totalVendidos > 0 ? (vendidos / totalVendidos) * 100 : 0
    }));
  }, [events, selectedDashboardEvent]);

  // Cálculo: Lotes esgotados e projeção de receita futura
  const { lotesEsgotados, projecaoReceitaFutura, ingressosRestantes } = React.useMemo(() => {
    const lotesEsgotados: Array<{ evento: string; lote: string; tipo: string }> = [];
    let projecaoReceitaFutura = 0;
    let ingressosRestantes = 0;
    getFilteredEvents().forEach(event => {
      event.batches.forEach(batch => {
        batch.tickets.forEach(ticket => {
          const restantes = ticket.quantity - ticket.soldQuantity;
          if (restantes === 0) {
            lotesEsgotados.push({
              evento: event.title,
              lote: batch.batchName,
              tipo: ticket.name
            });
          }
          projecaoReceitaFutura += restantes * ticket.price;
          ingressosRestantes += restantes;
        });
      });
    });
    return { lotesEsgotados, projecaoReceitaFutura, ingressosRestantes };
  }, [events, selectedDashboardEvent]);

  // Cálculo: Comparativo entre lotes (performance)
  const comparativoLotes = React.useMemo(() => {
    const lotes: Array<{
      evento: string;
      lote: string;
      vendidos: number;
      total: number;
      receita: number;
      taxaOcupacao: number;
      diasAtivo?: number;
      velocidadeVendas?: number;
    }> = [];
    
    getFilteredEvents().forEach(event => {
      event.batches.forEach(batch => {
        let vendidosLote = 0;
        let totalLote = 0;
        let receitaLote = 0;
        
        batch.tickets.forEach(ticket => {
          vendidosLote += ticket.soldQuantity;
          totalLote += ticket.quantity;
          receitaLote += ticket.soldQuantity * ticket.price;
        });
        
        // Calcular dias ativos do lote (se houver datas)
        let diasAtivo = undefined;
        let velocidadeVendas = undefined;
        if (batch.saleStart && batch.saleEnd) {
          const start = new Date(batch.saleStart);
          const end = new Date(batch.saleEnd);
          diasAtivo = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          velocidadeVendas = diasAtivo > 0 ? vendidosLote / diasAtivo : 0;
        }
        
        lotes.push({
          evento: event.title,
          lote: batch.batchName,
          vendidos: vendidosLote,
          total: totalLote,
          receita: receitaLote,
          taxaOcupacao: totalLote > 0 ? (vendidosLote / totalLote) * 100 : 0,
          diasAtivo,
          velocidadeVendas
        });
      });
    });
    
    // Ordenar por receita (maior primeiro)
    return lotes.sort((a, b) => b.receita - a.receita);
  }, [events, selectedDashboardEvent]);

  // Cálculo: Análise de atrações por período
  const analiseAtracoes = React.useMemo(() => {
    const analise: Array<{
      evento: string;
      periodo: string;
      atracoes: { name: string; social?: string }[];
      vendidos: number;
      receita: number;
    }> = [];
    
    getFilteredEvents().forEach(event => {
      event.dates.forEach((date) => {                
        // Calcular vendas para este período (assumindo que vendas são distribuídas igualmente)
        const totalVendasEvento = event.batches.reduce((acc, batch) => 
          acc + batch.tickets.reduce((sum, ticket) => sum + ticket.soldQuantity, 0), 0
        );
        const vendasPorPeriodo = totalVendasEvento / event.dates.length;
        const receitaPorPeriodo = event.batches.reduce((acc, batch) => 
          acc + batch.tickets.reduce((sum, ticket) => sum + (ticket.soldQuantity * ticket.price), 0), 0
        ) / event.dates.length;
        
        analise.push({
          evento: event.title,
          periodo: `${date.startDate} ${date.startTime} - ${date.endDate} ${date.endTime}`,
          atracoes: date.attractions || [],
          vendidos: Math.round(vendasPorPeriodo),
          receita: receitaPorPeriodo
        });
      });
    });
    
    return analise;
  }, [events, selectedDashboardEvent]);

  // Cores para o gráfico de pizza
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {/* Card de ingressos vendidos - agora clicável */}
        <Card
          className="cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200"
          onClick={() => setOpenTicketsModal(true)}
          title="Clique para ver relatório detalhado de ingressos"
        >
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

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card de taxa de ocupação */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hideValues ? "***" : `${taxaOcupacao.toFixed(1)}%`}</div>
            <Progress value={taxaOcupacao} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {formatNumber(totalIngressosVendidos)} de {formatNumber(totalIngressosDisponiveis)} vendidos
            </p>
          </CardContent>
        </Card>
        {/* Card de receita bruta */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(receitaBruta)}</div>
            <p className="text-xs text-muted-foreground">Total arrecadado</p>
          </CardContent>
        </Card>
        {/* Card de receita líquida */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Líquida</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(receitaLiquida)}</div>
            <p className="text-xs text-muted-foreground">Após taxa de 10%</p>
          </CardContent>
        </Card>
        {/* Card de preço médio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preço Médio Vendido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hideValues ? "***" : `R$ ${precoMedio.toFixed(2)}`}</div>
            <p className="text-xs text-muted-foreground">Média ponderada</p>
          </CardContent>
        </Card>
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

      {/* Relatório detalhado de ingressos vendidos */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-lg font-bold mb-2">Relatório de Ingressos Vendidos</h3>
        {getFilteredEvents().length === 0 ? (
          <p className="text-gray-600">Nenhum evento encontrado.</p>
        ) : (
          getFilteredEvents().map((event) => (
            <div key={event._id} className="mb-6">
              <h4 className="font-semibold text-base mb-2">{event.title}</h4>
              {event.batches && event.batches.length > 0 ? (
                event.batches.map((batch, bIdx) => (
                  <div key={bIdx} className="mb-2">
                    <div className="font-medium text-sm mb-1">Lote: {batch.batchName}</div>
                    <table className="min-w-full text-xs border mb-2">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-2 py-1 border">Ingresso</th>
                          <th className="px-2 py-1 border">Preço</th>
                          <th className="px-2 py-1 border">Vendidos</th>
                          <th className="px-2 py-1 border">Total</th>
                          <th className="px-2 py-1 border">Receita</th>
                          <th className="px-2 py-1 border">Taxa Ocupação</th>
                          <th className="px-2 py-1 border">Restantes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batch.tickets.map((ticket, tIdx) => (
                          <tr key={ticket._id || tIdx}>
                            <td className="px-2 py-1 border">{ticket.name}</td>
                            <td className="px-2 py-1 border">{formatCurrency(ticket.price)}</td>
                            <td className="px-2 py-1 border">{formatNumber(ticket.soldQuantity)}</td>
                            <td className="px-2 py-1 border">{formatNumber(ticket.quantity)}</td>
                            <td className="px-2 py-1 border">{formatCurrency(ticket.soldQuantity * ticket.price)}</td>
                            <td className="px-2 py-1 border">
                              {ticket.quantity > 0 ? `${((ticket.soldQuantity / ticket.quantity) * 100).toFixed(1)}%` : "-"}
                            </td>
                            <td className="px-2 py-1 border">
                              {formatNumber(ticket.quantity - ticket.soldQuantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs mb-2">Nenhum lote cadastrado.</p>
              )}
            </div>
          ))
        )}
      </div>
      {/* Gráfico de barras de ingressos vendidos por lote */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-lg font-bold mb-2">Ingressos Vendidos por Lote</h3>
        <div className="h-[240px] w-full">
          <ReResponsiveContainer width="100%" height="100%">
            <ReBarChart data={ticketsBarData} style={{ fontSize: 12 }}>
              <ReXAxis dataKey="lote" tickLine={false} axisLine={false} fontSize={10} />
              <ReYAxis tickLine={false} axisLine={false} fontSize={10} />
              <ReTooltip formatter={(value: any) => formatNumber(value)} />
              <ReBar dataKey="vendidos" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ReResponsiveContainer>
        </div>
      </div>

      {/* Modal de relatório detalhado de ingressos vendidos */}
      <Dialog open={openTicketsModal} onOpenChange={setOpenTicketsModal}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Relatório de Ingressos Vendidos</DialogTitle>
            <DialogDescription>
              Detalhamento de vendas por lote e tipo de ingresso
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            {getFilteredEvents().length === 0 ? (
              <p className="text-gray-600">Nenhum evento encontrado.</p>
            ) : (
              getFilteredEvents().map((event) => (
                <div key={event._id} className="mb-6">
                  <h4 className="font-semibold text-base mb-2">{event.title}</h4>
                  {event.batches && event.batches.length > 0 ? (
                    event.batches.map((batch, bIdx) => (
                      <div key={bIdx} className="mb-2">
                        <div className="font-medium text-sm mb-1">Lote: {batch.batchName}</div>
                        <table className="min-w-full text-xs border mb-2">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-2 py-1 border">Ingresso</th>
                              <th className="px-2 py-1 border">Preço</th>
                              <th className="px-2 py-1 border">Vendidos</th>
                              <th className="px-2 py-1 border">Total</th>
                              <th className="px-2 py-1 border">Receita</th>
                            </tr>
                          </thead>
                          <tbody>
                            {batch.tickets.map((ticket, tIdx) => (
                              <tr key={ticket._id || tIdx}>
                                <td className="px-2 py-1 border">{ticket.name}</td>
                                <td className="px-2 py-1 border">{formatCurrency(ticket.price)}</td>
                                <td className="px-2 py-1 border">{formatNumber(ticket.soldQuantity)}</td>
                                <td className="px-2 py-1 border">{formatNumber(ticket.quantity)}</td>
                                <td className="px-2 py-1 border">{formatCurrency(ticket.soldQuantity * ticket.price)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs mb-2">Nenhum lote cadastrado.</p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Alerta de lotes esgotados */}
      {lotesEsgotados.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {lotesEsgotados.length} {lotesEsgotados.length === 1 ? 'lote esgotado' : 'lotes esgotados'}
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside">
                  {lotesEsgotados.slice(0, 3).map((item, index) => (
                    <li key={index}>
                      {item.evento} - {item.lote} ({item.tipo})
                    </li>
                  ))}
                  {lotesEsgotados.length > 3 && (
                    <li>... e mais {lotesEsgotados.length - 3} lotes</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de pizza - Proporção de tipos de ingresso vendidos */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-lg font-bold mb-2">Proporção de Tipos de Ingresso Vendidos</h3>
        {proporcaoTiposIngresso.length > 0 ? (
          <div className="h-[300px] w-full">
            <PieResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={proporcaoTiposIngresso}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {proporcaoTiposIngresso.map((entry, index) => (
                    <Cell key={`cell-${index}-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </PieResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">Nenhum ingresso vendido ainda.</p>
        )}
      </div>

      {/* Card de projeção de receita futura */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projeção Receita Futura</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(projecaoReceitaFutura)}</div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(ingressosRestantes)} ingressos restantes
          </p>
        </CardContent>
      </Card>

      {/* Tabela comparativa de lotes */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-lg font-bold mb-2">Comparativo de Performance entre Lotes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Evento</th>
                <th className="px-2 py-1 border">Lote</th>
                <th className="px-2 py-1 border">Vendidos</th>
                <th className="px-2 py-1 border">Total</th>
                <th className="px-2 py-1 border">Taxa Ocupação</th>
                <th className="px-2 py-1 border">Receita</th>
                <th className="px-2 py-1 border">Dias Ativo</th>
                <th className="px-2 py-1 border">Velocidade</th>
              </tr>
            </thead>
            <tbody>
              {comparativoLotes.map((lote, index) => (
                <tr key={index} className={index === 0 ? "bg-yellow-50" : ""}>
                  <td className="px-2 py-1 border">{lote.evento}</td>
                  <td className="px-2 py-1 border font-medium">{lote.lote}</td>
                  <td className="px-2 py-1 border">{formatNumber(lote.vendidos)}</td>
                  <td className="px-2 py-1 border">{formatNumber(lote.total)}</td>
                  <td className="px-2 py-1 border">{lote.taxaOcupacao.toFixed(1)}%</td>
                  <td className="px-2 py-1 border">{formatCurrency(lote.receita)}</td>
                  <td className="px-2 py-1 border">{lote.diasAtivo || "-"}</td>
                  <td className="px-2 py-1 border">
                    {lote.velocidadeVendas ? `${lote.velocidadeVendas.toFixed(1)}/dia` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {comparativoLotes.length > 0 && (
          <p className="text-xs text-gray-600 mt-2">
            🏆 Lote em amarelo: Maior receita | Velocidade: ingressos vendidos por dia
          </p>
        )}
      </div>

      {/* Análise de atrações por período */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-lg font-bold mb-2">Análise de Atrações por Período</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 border">Evento</th>
                <th className="px-2 py-1 border">Período</th>
                <th className="px-2 py-1 border">Atrações</th>
                <th className="px-2 py-1 border">Vendidos (estimado)</th>
                <th className="px-2 py-1 border">Receita (estimada)</th>
              </tr>
            </thead>
            <tbody>
              {analiseAtracoes.map((periodo, index) => (
                <tr key={index}>
                  <td className="px-2 py-1 border">{periodo.evento}</td>
                  <td className="px-2 py-1 border">{periodo.periodo}</td>
                  <td className="px-2 py-1 border">
                    {periodo.atracoes.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {periodo.atracoes.map((atracao, idx) => (
                          <li key={idx} className="text-xs">{atracao.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500">Sem atrações</span>
                    )}
                  </td>
                  <td className="px-2 py-1 border">{formatNumber(periodo.vendidos)}</td>
                  <td className="px-2 py-1 border">{formatCurrency(periodo.receita)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          📊 Estimativas baseadas na distribuição igual de vendas entre períodos
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
