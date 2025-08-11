"use client";

import * as React from "react";
import {
  Award,
  Eye,
  EyeOff,
  Ticket,
  TrendingUp,
  UserCheck,
  Users,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart as ReBarChart,
  Bar as ReBar,
  XAxis as ReXAxis,
  YAxis as ReYAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer as ReResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatDate } from "date-fns";

// IMPORTANTE para colar no seu projeto:
// - Remova os tipos locais abaixo e importe os seus interfaces reais:
//   import type EventInterface from "@/interfaces/EventInterface"
// Aqui mantenho tipos mínimos para o preview no v0.

type TicketInterface = {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  soldQuantity: number;
  type?: "regular" | "student" | "senior" | "free";
  fee?: number;
  activateAt?: string;
  expireAt?: string;
};

type Batch = {
  batchName: string;
  saleStart?: string;
  saleEnd?: string;
  tickets: TicketInterface[];
};

type EventInterface = {
  _id: string;
  title: string;
  image?: string;
  dates: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    periodName?: string;
    attractions?: {
      name: string;
      social?: string;
      description?: string;
      startTime?: string;
      endTime?: string;
    }[];
  }[];
  participants: any[];
  certificateCount: number;
  batches: Batch[];
};

type RevenuePoint = { name: string; revenue: number };

export interface DashboardProps {
  events: EventInterface[];
  hideValues: boolean;
  setHideValues: (v: boolean) => void;
  selectedDashboardEvent: string | undefined;
  setSelectedDashboardEvent: (v: string | undefined) => void;
  dashboardMetrics: {
    totalTicketsSold: number;
    upcomingEvents: number; // No seu código, isso é "ingressos restantes"
    totalEvents: number;
    totalRevenue: number;
    checkinsCount: number;
    certificateCount: number;
    subscribersCount: number; // Novo campo para contar subscribers
  };
  revenueData: RevenuePoint[];
}

type TicketsBarDatum = { lote: string; vendidos: number; evento: string };

const CURRENCY = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;
const NUM = (n: number) => n.toLocaleString("pt-BR");

const COLORS = [
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#a78bfa",
  "#f97316",
  "#22c55e",
];

function mask(value: string | number, hidden: boolean) {
  return hidden ? "***" : value;
}

function SectionTitle({
  children,
  sub,
}: {
  children: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      <h3 className="text-base font-semibold">{children}</h3>
      {sub}
    </div>
  );
}

function MetricCard({
  title,
  icon,
  value,
  hint,
  accent = "bg-emerald-50 text-emerald-700",
}: {
  title: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  hint?: string;
  accent?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`h-8 w-8 rounded-md ${accent} grid place-items-center`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

function useFilteredEvents(events: EventInterface[], selected?: string) {
  return React.useMemo(() => {
    if (!selected || selected === "all") return events;
    return events.filter((e) => e._id === selected);
  }, [events, selected]);
}

function calcTicketsBarData(events: EventInterface[]): TicketsBarDatum[] {
  const data: TicketsBarDatum[] = [];
  events.forEach((ev) => {
    ev.batches.forEach((b) => {
      const vendidos = b.tickets.reduce((acc, t) => acc + t.soldQuantity, 0);
      data.push({ lote: b.batchName, vendidos, evento: ev.title });
    });
  });
  return data;
}

function useKPIs(events: EventInterface[]) {
  return React.useMemo(() => {
    let receitaBruta = 0;
    let receitaLiquida = 0;
    let totalVendidos = 0;
    let totalDisponiveis = 0;
    let somaPrecoQtd = 0;
    const taxa = 0.1;

    events.forEach((ev) => {
      ev.batches.forEach((b) => {
        b.tickets.forEach((t) => {
          receitaBruta += t.soldQuantity * t.price;
          receitaLiquida += t.soldQuantity * t.price * (1 - taxa);
          totalVendidos += t.soldQuantity;
          totalDisponiveis += t.quantity;
          somaPrecoQtd += t.soldQuantity * t.price;
        });
      });
    });
    const taxaOcupacao =
      totalDisponiveis > 0 ? (totalVendidos / totalDisponiveis) * 100 : 0;
    const precoMedio = totalVendidos > 0 ? somaPrecoQtd / totalVendidos : 0;

    return {
      receitaBruta,
      receitaLiquida,
      totalVendidos,
      totalDisponiveis,
      taxaOcupacao,
      precoMedio,
    };
  }, [events]);
}

function useProporcaoTiposIngresso(events: EventInterface[]) {
  return React.useMemo(() => {
    const tipos: Record<string, number> = {};
    let total = 0;
    events.forEach((ev) =>
      ev.batches.forEach((b) =>
        b.tickets.forEach((t) => {
          tipos[t.name] = (tipos[t.name] || 0) + t.soldQuantity;
          total += t.soldQuantity;
        })
      )
    );
    return Object.entries(tipos).map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
    }));
  }, [events]);
}

function useLotesEProjecao(events: EventInterface[]) {
  return React.useMemo(() => {
    const lotesEsgotados: Array<{
      evento: string;
      lote: string;
      tipo: string;
    }> = [];
    let projecaoReceitaFutura = 0;
    let ingressosRestantes = 0;

    events.forEach((ev) => {
      ev.batches.forEach((b) => {
        b.tickets.forEach((t) => {
          const rest = t.quantity - t.soldQuantity;
          if (rest === 0)
            lotesEsgotados.push({
              evento: ev.title,
              lote: b.batchName,
              tipo: t.name,
            });
          projecaoReceitaFutura += rest * t.price;
          ingressosRestantes += rest;
        });
      });
    });
    return { lotesEsgotados, projecaoReceitaFutura, ingressosRestantes };
  }, [events]);
}

// Função para verificar se um evento é gratuito
function isEventFree(events: EventInterface[]): boolean {
  if (!events.length) return false;
  
  // Se todos os tickets de todos os eventos têm preço 0, é gratuito
  return events.every(event => 
    event.batches.every(batch => 
      batch.tickets.every(ticket => ticket.price === 0)
    )
  );
}

function useComparativoLotes(events: EventInterface[]) {
  return React.useMemo(() => {
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

    events.forEach((ev) => {
      ev.batches.forEach((b) => {
        let vendidos = 0;
        let total = 0;
        let receita = 0;
        b.tickets.forEach((t) => {
          vendidos += t.soldQuantity;
          total += t.quantity;
          receita += t.soldQuantity * t.price;
        });
        let diasAtivo: number | undefined;
        let velocidadeVendas: number | undefined;
        if (b.saleStart && b.saleEnd) {
          const start = new Date(b.saleStart);
          const end = new Date(b.saleEnd);
          diasAtivo = Math.max(
            1,
            Math.ceil((end.getTime() - start.getTime()) / 86400000)
          );
          velocidadeVendas = vendidos / diasAtivo;
        }
        lotes.push({
          evento: ev.title,
          lote: b.batchName,
          vendidos,
          total,
          receita,
          taxaOcupacao: total > 0 ? (vendidos / total) * 100 : 0,
          diasAtivo,
          velocidadeVendas,
        });
      });
    });

    return lotes.sort((a, b) => b.receita - a.receita);
  }, [events]);
}

function useAnaliseAtracoes(events: EventInterface[]) {
  return React.useMemo(() => {
    const res: Array<{
      evento: string;
      periodo: string;
      atracoes: {
        name: string;
        social?: string;
        description?: string;
        startTime?: string;
        endTime?: string;
      }[];
      vendidos: number;
      receita: number;
    }> = [];

    events.forEach((ev) => {
      const totalVendasEvento = ev.batches.reduce(
        (acc, b) => acc + b.tickets.reduce((s, t) => s + t.soldQuantity, 0),
        0
      );
      const receitaEvento = ev.batches.reduce(
        (acc, b) =>
          acc + b.tickets.reduce((s, t) => s + t.soldQuantity * t.price, 0),
        0
      );
      const periods = ev.dates.length || 1;
      const vendasPorPeriodo = totalVendasEvento / periods;
      const receitaPorPeriodo = receitaEvento / periods;

      ev.dates.forEach((d) => {
        res.push({
          evento: ev.title,          
          periodo: `${formatDate(d.startDate,"dd/MM/yyyy")} ${d.startTime} - ${formatDate(d.endDate, "dd/MM/yyyy")} ${d.endTime}`,
          atracoes: d.attractions || [],
          vendidos: Math.round(vendasPorPeriodo),
          receita: receitaPorPeriodo,
        });
      });
    });
    return res;
  }, [events]);
}

function EventReport({
  events,
  hideValues,
}: {
  events: EventInterface[];
  hideValues: boolean;
}) {
  if (!events.length) {
    return (
      <p className="text-muted-foreground text-sm">Nenhum evento encontrado.</p>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <Card key={event._id} className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{event.title}</CardTitle>
            <CardDescription>
              Detalhamento por lote e tipo de ingresso
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {!event.batches?.length ? (
              <p className="text-muted-foreground text-xs">
                Nenhum lote cadastrado.
              </p>
            ) : (
              <div className="space-y-5">
                {event.batches.map((batch, idx) => {
                  const vendidosBatch = batch.tickets.reduce(
                    (a, t) => a + t.soldQuantity,
                    0
                  );
                  const totalBatch = batch.tickets.reduce(
                    (a, t) => a + t.quantity,
                    0
                  );
                  const receitaBatch = batch.tickets.reduce(
                    (a, t) => a + t.soldQuantity * t.price,
                    0
                  );
                  const taxa =
                    totalBatch > 0 ? (vendidosBatch / totalBatch) * 100 : 0;

                  return (
                    <div key={`${event._id}-${idx}`} className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">
                            Lote: {batch.batchName}
                          </h4>
                          {batch.saleStart && batch.saleEnd ? (
                            <Badge variant="outline" className="text-[10px]">
                              {new Date(batch.saleStart).toLocaleDateString(
                                "pt-BR"
                              )}{" "}
                              -{" "}
                              {new Date(batch.saleEnd).toLocaleDateString(
                                "pt-BR"
                              )}
                            </Badge>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Total:</span>
                          <Badge variant="secondary">{NUM(totalBatch)}</Badge>
                          <Separator orientation="vertical" className="h-4" />
                          <span>Vendidos:</span>
                          <Badge variant="secondary">
                            {mask(NUM(vendidosBatch), hideValues as boolean)}
                          </Badge>
                          <Separator orientation="vertical" className="h-4" />
                          <span>Receita:</span>
                          <Badge variant="secondary">
                            {mask(
                              CURRENCY(receitaBatch),
                              hideValues as boolean
                            )}
                          </Badge>
                        </div>
                      </div>

                      <div className="rounded-md border">
                        <ScrollArea className="w-full">
                          <Table>
                            <TableHeader className="sticky top-0 bg-accent/40">
                              <TableRow>
                                <TableHead>Ingresso</TableHead>
                                <TableHead className="text-right">
                                  Preço
                                </TableHead>
                                <TableHead className="text-right">
                                  Vendidos
                                </TableHead>
                                <TableHead className="text-right">
                                  Total
                                </TableHead>
                                <TableHead className="text-right">
                                  Receita
                                </TableHead>
                                <TableHead className="text-right">
                                  Ocupação
                                </TableHead>
                                <TableHead className="text-right">
                                  Restantes
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {batch.tickets.map((ticket, tIdx) => {
                                const receita =
                                  ticket.soldQuantity * ticket.price;
                                const ocup =
                                  ticket.quantity > 0
                                    ? (ticket.soldQuantity / ticket.quantity) *
                                      100
                                    : 0;
                                const rest =
                                  ticket.quantity - ticket.soldQuantity;
                                return (
                                  <TableRow
                                    key={ticket._id ?? tIdx}
                                    className="hover:bg-muted/30"
                                  >
                                    <TableCell className="font-medium">
                                      {ticket.name}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {mask(CURRENCY(ticket.price), hideValues)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {mask(
                                        NUM(ticket.soldQuantity),
                                        hideValues
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {NUM(ticket.quantity)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {mask(CURRENCY(receita), hideValues)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex items-center gap-2 justify-end">
                                        <span className="text-xs text-muted-foreground">
                                          {ocup.toFixed(1)}%
                                        </span>
                                        <div className="w-28">
                                          <Progress
                                            value={ocup}
                                            className="h-2"
                                          />
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {mask(NUM(rest), hideValues)}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                              <TableRow className="bg-muted/20">
                                <TableCell className="font-semibold">
                                  Totais do lote
                                </TableCell>
                                <TableCell />
                                <TableCell className="text-right font-semibold">
                                  {mask(NUM(vendidosBatch), hideValues)}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {NUM(totalBatch)}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {mask(CURRENCY(receitaBatch), hideValues)}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {taxa.toFixed(1)}%
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {mask(
                                    NUM(totalBatch - vendidosBatch),
                                    hideValues
                                  )}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Dashboard({
  events,
  hideValues,
  setHideValues,
  selectedDashboardEvent,
  setSelectedDashboardEvent,
  dashboardMetrics,
  revenueData,
}: DashboardProps) {
  const filtered = useFilteredEvents(events, selectedDashboardEvent);

  const {
    receitaBruta,
    receitaLiquida,
    totalVendidos,
    totalDisponiveis,
    taxaOcupacao,
    precoMedio,
  } = useKPIs(filtered);
  const proporcaoTipos = useProporcaoTiposIngresso(filtered);
  const { lotesEsgotados } = useLotesEProjecao(filtered);
  const comparativoLotes = useComparativoLotes(filtered);
  const analiseAtracoes = useAnaliseAtracoes(filtered);
  const ticketsBarData = React.useMemo(
    () => calcTicketsBarData(filtered),
    [filtered]
  );

  // Verifica se o evento selecionado é gratuito
  const isFreeEvent = isEventFree(filtered);

  const handleCheckinsClick = () => {
    if (selectedDashboardEvent && selectedDashboardEvent !== "all") {
      // No seu projeto você pode voltar a usar useNavigate.
      window.location.assign(`/event-arrivals/${selectedDashboardEvent}`);
    }
  };

  const handleSubscribersClick = () => {
    if (selectedDashboardEvent && selectedDashboardEvent !== "all") {
      // No seu projeto você pode voltar a usar useNavigate.
      window.location.assign(`/event-subscribers/${selectedDashboardEvent}`);
    }
  };

  // Verifica se um evento específico está selecionado
  const isSpecificEventSelected = selectedDashboardEvent && selectedDashboardEvent !== "all";

  return (
    <div className="space-y-6">
      {/* Filtros e controles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHideValues(!hideValues)}
            className="cursor-pointer"
            title={hideValues ? "Mostrar valores" : "Ocultar valores"}
          >
            {hideValues ? (
              <Eye className="h-4 w-4 mr-2" />
            ) : (
              <EyeOff className="h-4 w-4 mr-2" />
            )}
            {hideValues ? "Mostrar" : "Ocultar"} valores
          </Button>

          <div className="flex-1 min-w-[220px]">
            <Select
              value={selectedDashboardEvent}
              onValueChange={setSelectedDashboardEvent}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecionar evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os eventos</SelectItem>
                {events.map((ev) => (
                  <SelectItem key={ev._id} value={ev._id}>
                    {ev.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resumo rápido à direita */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">Eventos: {events.length}</Badge>
          <Separator orientation="vertical" className="h-4" />
          <span>
            Selecionado:{" "}
            {selectedDashboardEvent
              ? selectedDashboardEvent === "all"
                ? "Todos"
                : "1"
              : "-"}
          </span>
          {isFreeEvent && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="outline" className="text-green-600 border-green-300">
                Evento Gratuito
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          className={`${
            isSpecificEventSelected
              ? "cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              : ""
          }`}
          title={isSpecificEventSelected ? "Clique para ver relatório detalhado de ingressos" : ""}
          onClick={() => {
            if (isSpecificEventSelected) {
              const target = document.getElementById("details");
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingressos Vendidos
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-700 grid place-items-center">
              <Ticket className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mask(NUM(dashboardMetrics.totalTicketsSold), hideValues)}
            </div>
            <p className="text-xs text-muted-foreground">Vendas no total</p>
          </CardContent>
        </Card>

        <MetricCard
          title="Ingressos Restantes"
          icon={<Users className="h-4 w-4" />}
          value={mask(NUM(dashboardMetrics.upcomingEvents), hideValues)}
          hint="Disponíveis para venda"
          accent="bg-amber-50 text-amber-700"
        />

        {/* Receita Total - só mostra se não for evento gratuito */}
        {!isFreeEvent && (
          <MetricCard
            title="Receita Total"
            icon={<TrendingUp className="h-4 w-4" />}
            value={mask(CURRENCY(dashboardMetrics.totalRevenue), hideValues)}
            hint={
              isSpecificEventSelected
                ? "Do evento selecionado"
                : "De todos os eventos"
            }
            accent="bg-violet-50 text-violet-700"
          />
        )}

        <MetricCard
          title="Certificados Gerados"
          icon={<Award className="h-4 w-4" />}
          value={mask(NUM(dashboardMetrics.certificateCount || 0), hideValues)}
          hint="Total emitidos"
          accent="bg-slate-100 text-slate-700"
        />
      </div>

      {/* KPIs secundários - só mostra se não for evento gratuito */}
      {!isFreeEvent && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Ocupação
              </CardTitle>
              <div className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-700 grid place-items-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mask(`${taxaOcupacao.toFixed(1)}%`, hideValues)}
              </div>
              <Progress value={taxaOcupacao} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {mask(NUM(totalVendidos), hideValues)} de {NUM(totalDisponiveis)}{" "}
                vendidos
              </p>
            </CardContent>
          </Card>

          <MetricCard
            title="Receita Bruta"
            icon={<TrendingUp className="h-4 w-4" />}
            value={mask(CURRENCY(receitaBruta), hideValues)}
            hint="Total arrecadado"
            accent="bg-slate-100 text-slate-700"
          />

          <MetricCard
            title="Receita Líquida"
            icon={<TrendingUp className="h-4 w-4" />}
            value={mask(CURRENCY(receitaLiquida), hideValues)}
            hint="Após taxa de 10%"
            accent="bg-slate-100 text-slate-700"
          />

          <MetricCard
            title="Preço Médio Vendido"
            icon={<TrendingUp className="h-4 w-4" />}
            value={mask(CURRENCY(Number(precoMedio.toFixed(2))), hideValues)}
            hint="Média ponderada"
            accent="bg-slate-100 text-slate-700"
          />
        </div>
      )}

      {/* Check-ins e Subscribers - apenas quando evento específico selecionado */}
      {isSpecificEventSelected && (
        <div className={`grid gap-4 ${isFreeEvent ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            onClick={handleCheckinsClick}
            title="Clique para ver check-ins"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Check-ins Realizados
              </CardTitle>
              <div className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-700 grid place-items-center">
                <UserCheck className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mask(NUM(dashboardMetrics.checkinsCount || 0), hideValues)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pessoas que validaram ingresso
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
            onClick={handleSubscribersClick}
            title="Clique para ver subscribers"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscribers do Evento
              </CardTitle>
              <div className="h-8 w-8 rounded-md bg-blue-50 text-blue-700 grid place-items-center">
                <UserPlus className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mask(NUM(dashboardMetrics.subscribersCount || 0), hideValues)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pessoas inscritas no evento
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overview (Receita por mês) - só mostra se não for evento gratuito */}
      {!isFreeEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Receita por mês
              {isSpecificEventSelected
                ? ` - ${
                    events.find((e) => e._id === selectedDashboardEvent)?.title ||
                    ""
                  }`
                : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] sm:h-[300px] lg:h-[360px] w-full">
              <ReResponsiveContainer width="100%" height="100%">
                <ReBarChart data={revenueData} style={{ fontSize: 12 }}>
                  <ReXAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    dy={8}
                    fontSize={10}
                  />
                  <ReYAxis
                    tickLine={false}
                    axisLine={false}
                    width={70}
                    fontSize={10}
                    tickFormatter={(v) => (hideValues ? "***" : `R$${v}`)}
                  />
                  <ReTooltip
                    formatter={(value: any) =>
                      hideValues ? "***" : CURRENCY(Number(value))
                    }
                    labelClassName="text-xs"
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid hsl(0 0% 90%)",
                    }}
                  />
                  <ReBar dataKey="revenue" fill="#334155" radius={[6, 6, 0, 0]} />
                </ReBarChart>
              </ReResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertas de lotes esgotados */}
      {lotesEsgotados.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 text-amber-500">!</div>
            <div>
              <h4 className="text-sm font-medium text-amber-800">
                {lotesEsgotados.length}{" "}
                {lotesEsgotados.length === 1
                  ? "lote esgotado"
                  : "lotes esgotados"}
              </h4>
              <ul className="mt-2 text-sm text-amber-700 list-disc list-inside">
                {lotesEsgotados.slice(0, 3).map((i, idx) => (
                  <li key={`${i.evento}-${i.lote}-${idx}`}>
                    {i.evento} - {i.lote} ({i.tipo})
                  </li>
                ))}
                {lotesEsgotados.length > 3 && (
                  <li>... e mais {lotesEsgotados.length - 3} lotes</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Detalhes específicos - apenas quando evento específico selecionado */}
      {isSpecificEventSelected && (
        <div id="details">
          {/* Pizza: Proporção de tipos de ingresso vendidos - só mostra se não for evento gratuito */}
          {!isFreeEvent && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Proporção de Tipos de Ingresso Vendidos
                </CardTitle>
                <CardDescription>Distribuição por tipo</CardDescription>
              </CardHeader>
              <CardContent>
                {proporcaoTipos.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[280px]">
                      <ReResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={proporcaoTipos}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={90}
                            dataKey="value"
                          >
                            {proporcaoTipos.map((entry, index) => (
                              <Cell
                                key={`${entry.name}-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Legend verticalAlign="bottom" height={24} />
                        </PieChart>
                      </ReResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {proporcaoTipos.map((p, i) => (
                        <div
                          key={p.name}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-3 w-3 rounded-sm"
                              style={{
                                backgroundColor: COLORS[i % COLORS.length],
                              }}
                            />
                            <span className="text-sm">{p.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {mask(`${p.percentage.toFixed(1)}%`, hideValues)}
                            <span className="ml-2">
                              ({mask(NUM(p.value), hideValues)})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-6">
                    Nenhum ingresso vendido ainda.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Ingressos Vendidos por Lote - só mostra se não for evento gratuito */}
          {!isFreeEvent && (
            <Card>
              <CardHeader>
                <CardTitle>Ingressos Vendidos por Lote</CardTitle>
                <CardDescription>
                  Comparativo entre lotes do(s) evento(s) filtrado(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px] w-full">
                  <ReResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={ticketsBarData} style={{ fontSize: 12 }}>
                      <ReXAxis
                        dataKey="lote"
                        tickLine={false}
                        axisLine={false}
                        fontSize={10}
                      />
                      <ReYAxis tickLine={false} axisLine={false} fontSize={10} />
                      <ReTooltip
                        formatter={(value: any, _name, payload: any) => [
                          `${hideValues ? "***" : NUM(value as number)} vendidos`,
                          payload?.payload?.evento,
                        ]}
                        labelFormatter={(label) => `Lote: ${label}`}
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid hsl(0 0% 90%)",
                        }}
                      />
                      <ReBar
                        dataKey="vendidos"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                      />
                    </ReBarChart>
                  </ReResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Relatório detalhado - só mostra se não for evento gratuito */}
          {!isFreeEvent && (
            <div className="space-y-2">
              <SectionTitle>Relatório de Ingressos Vendidos</SectionTitle>
              <EventReport events={filtered} hideValues={hideValues} />
            </div>
          )}

          {/* Comparativo de performance entre lotes - só mostra se não for evento gratuito */}
          {!isFreeEvent && (
            <div className="space-y-2">
              <SectionTitle>Comparativo de Performance entre Lotes</SectionTitle>
              <div className="rounded-md border overflow-hidden">
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader className="sticky top-0 bg-accent/40">
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead className="text-right">Vendidos</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">
                          Taxa Ocupação
                        </TableHead>
                        <TableHead className="text-right">Receita</TableHead>
                        <TableHead className="text-right">Dias Ativo</TableHead>
                        <TableHead className="text-right">Velocidade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparativoLotes.map((l, idx) => (
                        <TableRow
                          key={`${l.evento}-${l.lote}-${idx}`}
                          className={idx === 0 ? "bg-amber-50/60" : ""}
                        >
                          <TableCell>{l.evento}</TableCell>
                          <TableCell className="font-medium">{l.lote}</TableCell>
                          <TableCell className="text-right">
                            {mask(NUM(l.vendidos), hideValues)}
                          </TableCell>
                          <TableCell className="text-right">
                            {NUM(l.total)}
                          </TableCell>
                          <TableCell className="text-right">
                            {l.taxaOcupacao.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right">
                            {mask(CURRENCY(l.receita), hideValues)}
                          </TableCell>
                          <TableCell className="text-right">
                            {l.diasAtivo ?? "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {l.velocidadeVendas
                              ? `${l.velocidadeVendas.toFixed(1)}/dia`
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              {!!comparativoLotes.length && (
                <p className="text-xs text-muted-foreground mt-2">
                  🏆 Linha destacada: maior receita | Velocidade = ingressos/dia
                </p>
              )}
            </div>
          )}

          {/* Análise de atrações por período - só mostra se não for evento gratuito */}
          {!isFreeEvent && (
            <div className="space-y-2">
              <SectionTitle>Análise de Atrações por Período</SectionTitle>

              {/* Mobile: cards */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {analiseAtracoes.map((p, i) => (
                  <Card key={`${p.evento}-${i}`} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{p.evento}</CardTitle>
                      <CardDescription className="text-xs">
                        {p.periodo}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-xs">
                        <span className="text-muted-foreground">Atrações: </span>
                        {p.atracoes?.length
                          ? p.atracoes.map((a) => a.name).join(", ")
                          : "Sem atrações"}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Vendidos (est.):</span>
                        <span className="font-medium">
                          {mask(NUM(p.vendidos), hideValues)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Receita (est.):</span>
                        <span className="font-medium">
                          {mask(CURRENCY(p.receita), hideValues)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop: tabela */}
              <div className="hidden md:block rounded-md border overflow-hidden">
                <ScrollArea className="w-full">
                  <Table>
                    <TableHeader className="sticky top-0 bg-accent/40">
                      <TableRow>
                        <TableHead>Evento</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Atrações</TableHead>
                        <TableHead className="text-right">
                          Vendidos (est.)
                        </TableHead>
                        <TableHead className="text-right">
                          Receita (est.)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analiseAtracoes.map((p, i) => (
                        <TableRow key={`${p.evento}-${i}`}>
                          <TableCell>{p.evento}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {p.periodo}
                          </TableCell>
                          <TableCell>
                            {p.atracoes?.length ? (
                              <div className="flex flex-wrap gap-1">
                                {p.atracoes.map((a, idx) => (
                                  <Badge
                                    key={`${a.name}-${idx}`}
                                    variant="outline"
                                  >
                                    {a.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                Sem atrações
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {mask(NUM(p.vendidos), hideValues)}
                          </TableCell>
                          <TableCell className="text-right">
                            {mask(CURRENCY(p.receita), hideValues)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              <p className="text-xs text-muted-foreground">
                📊 Estimativas baseadas na distribuição igual de vendas entre
                períodos
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
