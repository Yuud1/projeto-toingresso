"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Users,
  Search,
  Download,
  RefreshCw,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Grid,
  List,
  ArrowLeft,
  Printer,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import EventInterface from "@/interfaces/EventInterface";
import CustomFieldInterface from "@/interfaces/CustomFieldInterface";
import getInitials from "@/utils/getInitials";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SubscriberData {
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  fields: Record<string, string>;
  subscribedAt: string;
  _id: string;
}

interface PrintConfig {
  selectedFields: string[];
  paperSize: "A4" | "A5" | "A6" | "thermal" | "custom";
  customWidth: number;
  customHeight: number;
  fontSize: "small" | "medium" | "large";
  showEventInfo: boolean;
  showTimestamp: boolean;
}

export default function EventSubscribersPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventInterface | null>(null);
  const [subscribers, setSubscribers] = useState<SubscriberData[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<
    SubscriberData[]
  >([]);

  console.log("Event: ", event);
  console.log("Subscribers: ", subscribers);
    
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<SubscriberData | null>(null);
  const [printConfig, setPrintConfig] = useState<PrintConfig>({
    selectedFields: ["Nome completo", "Email"],
    paperSize: "thermal",
    customWidth: 105,
    customHeight: 148,
    fontSize: "medium",
    showEventInfo: true,
    showTimestamp: false,
  });

  useEffect(() => {
    fetchEventData();
  }, [id]);

  useEffect(() => {
    filterSubscribers();
  }, [subscribers, searchTerm]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_GET_ARRIVALS_SUBSCRIBERS
        }/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEvent(response.data.event);

      // Extrair subscribers do evento
      const eventSubscribers = response.data.event.subscribers || [];
      setSubscribers(eventSubscribers);
    } catch (error) {
      console.error("Erro ao buscar dados do evento:", error);
    } finally {
      setLoading(false);
    }
  };

  // Função para obter o valor de um campo do subscriber
  const getSubscriberFieldValue = (subscriber: SubscriberData, fieldLabel: string): string => {
    // Campos padrão (name e avatar)
    if (fieldLabel.toLowerCase() === "nome" || fieldLabel.toLowerCase() === "name") {
      return subscriber.fields?.name || subscriber.userId?.name || "";
    }
    
    if (fieldLabel.toLowerCase() === "email") {
      return subscriber.fields?.email || subscriber.userId?.email || "";
    }

    // Para outros campos, buscar nos customFields
    const customField = event?.customFields?.find(field => 
      field.label.toLowerCase() === fieldLabel.toLowerCase()
    );
    
    if (customField) {
      return subscriber.fields[customField.label] || "";
    }

    return "";
  };

  // Função para renderizar um campo customizado
  const renderCustomField = (subscriber: SubscriberData, customField: CustomFieldInterface) => {
    const value = subscriber.fields[customField.label] || "";
    
    if (!value) return null;

    // Escolher ícone baseado no tipo do campo
    const getFieldIcon = (type: string) => {
      switch (type) {
        case "email":
          return <Mail className="h-4 w-4" />;
        case "number":
          // Verificar se é telefone baseado no label
          if (customField.label.toLowerCase().includes("telefone") || customField.label.toLowerCase().includes("phone")) {
            return <Phone className="h-4 w-4" />;
          }
          return <User className="h-4 w-4" />;
        default:
          return <User className="h-4 w-4" />;
      }
    };

    return (
      <div key={customField._id} className="flex items-center justify-center space-x-2">
        {getFieldIcon(customField.type)}
        <span className="text-sm">
          {value}
        </span>
      </div>
    );
  };

  // Função para renderizar campos customizados na visualização de lista
  const renderCustomFieldList = (subscriber: SubscriberData, customField: CustomFieldInterface) => {
    const value = subscriber.fields[customField.label] || "";
    
    if (!value) return null;

    const getFieldIcon = (type: string) => {
      switch (type) {
        case "email":
          return <Mail className="h-3 w-3" />;
        case "number":
          // Verificar se é telefone baseado no label
          if (customField.label.toLowerCase().includes("telefone") || customField.label.toLowerCase().includes("phone")) {
            return <Phone className="h-3 w-3" />;
          }
          return <User className="h-3 w-3" />;
        default:
          return <User className="h-3 w-3" />;
      }
    };

    return (
      <span key={customField._id} className="flex items-center space-x-1">
        {getFieldIcon(customField.type)}
        <span className="truncate">
          {value}
        </span>
      </span>
    );
  };

  // Função para abrir modal de configuração de impressão
  const openPrintConfig = (subscriber: SubscriberData) => {
    setSelectedSubscriber(subscriber);
    setShowPrintModal(true);
  };

  // Função para alternar seleção de campo
  const toggleFieldSelection = (fieldLabel: string) => {
    setPrintConfig(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldLabel)
        ? prev.selectedFields.filter(field => field !== fieldLabel)
        : [...prev.selectedFields, fieldLabel]
    }));
  };

  // Função para imprimir dados do subscriber com configuração personalizada
  const printSubscriberData = (subscriber: SubscriberData, config: PrintConfig) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const eventTitle = event?.title || "Evento";
    const eventDate = event?.dates?.[0]?.startDate ? 
      formatDate(new Date(event.dates[0].startDate), "dd/MM/yyyy", { locale: ptBR }) : "";
    const eventVenue = event?.venueName || "";

    // Verificar se é impressão térmica (baseado no tipo selecionado, não na quantidade de campos)
    const isThermalPrint = config.paperSize === "thermal";

    // Configurar tamanho do papel
    const getPaperSize = () => {
      // Para impressão térmica, usar tamanho mais compatível
      if (isThermalPrint) {
        // Usar o tamanho selecionado pelo usuário, mesmo para térmica
        switch (config.paperSize) {
          case "A4": return "210mm 297mm";
          case "A5": return "148mm 210mm";
          case "A6": return "105mm 148mm";
          case "thermal": return "80mm 120mm";
          case "custom": return `${config.customWidth}mm ${config.customHeight}mm`;
          default: return "80mm 120mm"; // Tamanho padrão para térmica mais compatível
        }
      }
      
      // Para credenciais completas
      switch (config.paperSize) {
        case "A4": return "210mm 297mm";
        case "A5": return "148mm 210mm";
        case "A6": return "105mm 148mm";
        case "thermal": return "80mm 120mm";
        case "custom": return `${config.customWidth}mm ${config.customHeight}mm`;
        default: return "105mm 148mm";
      }
    };

    const paperSize = getPaperSize();
    console.log('Tamanho da página configurado:', paperSize);
    console.log('É impressão térmica:', isThermalPrint);
    console.log('Tamanho selecionado:', config.paperSize);

    // Configurar tamanho da fonte
    const getFontSize = () => {
      if (isThermalPrint) {
        return "16px"; // Fonte maior para impressoras térmicas
      }
      switch (config.fontSize) {
        case "small": return "12px";
        case "medium": return "14px";
        case "large": return "16px";
        default: return "14px";
      }
    };

    // Gerar conteúdo baseado no tipo de impressão
    let printContent = '';

    if (isThermalPrint) {
      // Impressão térmica simples - pode ter múltiplos campos
      printContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Impressão Térmica</title>
          <style>
            * {
              box-sizing: border-box;
            }
            
            @page {
              size: ${getPaperSize()};
              margin: 5mm;
            }
            
            @media print {
              html, body { 
                margin: 0 !important; 
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
              }
              .no-print { display: none !important; }
              .thermal-content {
                width: 100% !important;
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
              }
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            
            body {
              font-family: 'Courier New', monospace;
              line-height: 1.2;
              color: #000;
              background: white;
              margin: 0;
              padding: 5mm;
              font-size: ${getFontSize()};
              text-align: center;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }
            
            .thermal-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              min-height: 50mm;
              gap: 8px;
            }
            
            .field-group {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 2px;
            }
            
            .field-label {
              font-size: ${getFontSize()};
              font-weight: bold;
              color: #000;
              text-transform: uppercase;
              letter-spacing: 1px;
              line-height: 1.2;
            }
            
            .field-value {
              font-size: ${getFontSize()};
              font-weight: bold;
              color: #000;
              word-break: break-word;
              text-transform: uppercase;
              letter-spacing: 1px;
              line-height: 1.4;
              max-width: 100%;
              overflow-wrap: break-word;
            }
            
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #2563eb;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              z-index: 1000;
            }
            
            .print-button:hover {
              background: #1d4ed8;
            }
            
            @media print {
              .print-button { display: none; }
            }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">
            🖨️ Imprimir Térmica
          </button>
          
          <div class="thermal-content">
            ${config.selectedFields.map(fieldLabel => {
              const value = getSubscriberFieldValue(subscriber, fieldLabel);
              if (!value) return '';
              return `
                <div class="field-value">${value}</div>
              `;
            }).join('')}
          </div>
        </body>
        </html>
      `;
    } else {
      // Impressão de credencial completa
      printContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Credenciamento - ${eventTitle}</title>
          <style>
            * {
              box-sizing: border-box;
            }
            
            @page {
              size: ${getPaperSize()};
              margin: 10mm;
            }
            
            @media print {
              html, body { 
                margin: 0; 
                padding: 0;
                width: 100%;
                height: 100%;
              }
              .no-print { display: none !important; }
            }
            
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.4;
              color: #333;
              background: white;
              margin: 0;
              padding: 10mm;
              font-size: ${getFontSize()};
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .credential-card {
              border: 2px solid #2563eb;
              border-radius: 8px;
              padding: 15px;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              width: 100%;
              max-width: 100%;
              min-height: 120mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            
            .header {
              text-align: center;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 10px;
              margin-bottom: 15px;
            }
            
            .header h1 {
              color: #2563eb;
              margin: 0;
              font-size: ${config.fontSize === "large" ? "18px" : config.fontSize === "small" ? "14px" : "16px"};
              font-weight: bold;
              text-transform: uppercase;
            }
            
            .header p {
              margin: 3px 0 0 0;
              color: #64748b;
              font-size: ${config.fontSize === "large" ? "12px" : config.fontSize === "small" ? "10px" : "11px"};
            }
            
            .participant-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            
            .field-group {
              display: flex;
              flex-direction: column;
              gap: 2px;
            }
            
            .field-label {
              font-weight: bold;
              color: #475569;
              font-size: ${config.fontSize === "large" ? "11px" : config.fontSize === "small" ? "9px" : "10px"};
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .field-value {
              font-size: ${config.fontSize === "large" ? "13px" : config.fontSize === "small" ? "11px" : "12px"};
              color: #1e293b;
              word-break: break-word;
              padding: 2px 0;
            }
            
            .event-info {
              border-top: 1px solid #cbd5e1;
              padding-top: 10px;
              margin-top: 10px;
            }
            
            .event-info h3 {
              color: #334155;
              margin: 0 0 8px 0;
              font-size: ${config.fontSize === "large" ? "12px" : config.fontSize === "small" ? "10px" : "11px"};
              text-transform: uppercase;
            }
            
            .event-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 8px;
              font-size: ${config.fontSize === "large" ? "10px" : config.fontSize === "small" ? "8px" : "9px"};
            }
            
            .event-detail {
              display: flex;
              flex-direction: column;
            }
            
            .event-detail-label {
              font-weight: bold;
              color: #64748b;
              text-transform: uppercase;
              font-size: ${config.fontSize === "large" ? "8px" : config.fontSize === "small" ? "6px" : "7px"};
            }
            
            .event-detail-value {
              color: #334155;
              font-weight: 500;
            }
            
            .footer {
              text-align: center;
              margin-top: 10px;
              padding-top: 8px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: ${config.fontSize === "large" ? "8px" : config.fontSize === "small" ? "6px" : "7px"};
            }
            
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              background: #2563eb;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              z-index: 1000;
            }
            
            .print-button:hover {
              background: #1d4ed8;
            }
            
            @media print {
              .print-button { display: none; }
            }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">
            🖨️ Imprimir Credencial
          </button>
          
          <div class="credential-card">
            <div class="header">
              <h1>${eventTitle}</h1>
              <p>Credencial de Participante</p>
              ${config.showTimestamp ? `<p>Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>` : ''}
            </div>
            
            <div class="participant-info">
              ${config.selectedFields.map(fieldLabel => {
                const value = getSubscriberFieldValue(subscriber, fieldLabel);
                if (!value) return '';
                return `
                  <div class="field-group">
                    <div class="field-label">${fieldLabel}</div>
                    <div class="field-value">${value}</div>
                  </div>
                `;
              }).join('')}
            </div>
            
            ${config.showEventInfo ? `
              <div class="event-info">
                <h3>Informações do Evento</h3>
                <div class="event-details">
                  <div class="event-detail">
                    <div class="event-detail-label">Data</div>
                    <div class="event-detail-value">${eventDate}</div>
                  </div>
                  <div class="event-detail">
                    <div class="event-detail-label">Local</div>
                    <div class="event-detail-value">${eventVenue}</div>
                  </div>
                </div>
              </div>
            ` : ''}
            
            <div class="footer">
              <p>ToIngresso - Sistema de Credenciamento</p>
              <p>ID: ${subscriber._id}</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const filterSubscribers = () => {
    if (!searchTerm.trim()) {
      setFilteredSubscribers(subscribers);
      return;
    }

    const filtered = subscribers.filter((subscriber) => {
      const searchLower = searchTerm.toLowerCase();
      
      // Buscar no nome (campo padrão)
      const name = subscriber.fields?.name || subscriber.userId?.name || "";
      if (name.toLowerCase().includes(searchLower)) return true;

      // Buscar no email (campo padrão)
      const email = subscriber.fields?.email || subscriber.userId?.email || "";
      if (email.toLowerCase().includes(searchLower)) return true;

      // Buscar nos campos customizados
      if (event?.customFields) {
        for (const customField of event.customFields) {
          const value = subscriber.fields[customField.label] || "";
          if (value.toLowerCase().includes(searchLower)) return true;
        }
      }

      return false;
    });

    setFilteredSubscribers(filtered);
  };

  const exportToCSV = () => {
    if (!subscribers.length || !event) return;

    // Criar headers dinâmicos baseados nos customFields
    const headers = ["Nome", "Email"];
    
    // Adicionar headers dos campos customizados
    if (event.customFields) {
      event.customFields.forEach(field => {
        headers.push(field.label);
      });
    }
    
    headers.push("Data de Inscrição");

    const csvContent = [
      headers.join(","),
      ...subscribers.map((subscriber) => {
        const row = [
          `"${subscriber.fields?.name || subscriber.userId?.name || ""}"`,
          `"${subscriber.fields?.email || subscriber.userId?.email || ""}"`
        ];

        // Adicionar valores dos campos customizados
        if (event.customFields) {
          event.customFields.forEach(field => {
            const value = subscriber.fields[field.label] || "";
            row.push(`"${value}"`);
          });
        }

        const date = new Date(subscriber.subscribedAt).toLocaleDateString("pt-BR");
        row.push(`"${date}"`);

        return row.join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `subscribers-${event?.title || "evento"}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando dados do evento...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Evento não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Subscribers do Evento
                </h1>
                <p className="text-sm text-gray-500">{event.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total de Subscribers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {subscribers.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Data do Evento
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(
                      new Date(event.dates[0].startDate),
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR }
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Local</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {event.venueName}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, email ou campos customizados..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="flex items-center space-x-2"
              >
                {showSensitiveData ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>Ocultar Dados</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Mostrar Dados</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                className="flex items-center space-x-2"
              >
                {viewMode === "grid" ? (
                  <>
                    <List className="h-4 w-4" />
                    <span>Lista</span>
                  </>
                ) : (
                  <>
                    <Grid className="h-4 w-4" />
                    <span>Grid</span>
                  </>
                )}
              </Button>

              <Button
                onClick={exportToCSV}
                className="flex items-center space-x-2"
                disabled={!subscribers.length}
              >
                <Download className="h-4 w-4" />
                <span>Exportar CSV</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Subscribers List */}
        {filteredSubscribers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm
                  ? "Nenhum subscriber encontrado"
                  : "Nenhum subscriber ainda"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Tente ajustar os termos de busca"
                  : "Os subscribers aparecerão aqui quando se inscreverem no evento"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredSubscribers.map((subscriber, index) => (
              <Card
                key={subscriber._id || index}
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  {viewMode === "grid" ? (
                    <div className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarImage
                          src={subscriber.userId?.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-lg font-bold">
                          {getInitials(
                            subscriber.fields?.name ||
                              subscriber.userId?.name ||
                              "U"
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="font-bold text-lg mb-3 text-slate-900">
                        {subscriber.fields?.name ||
                          subscriber.userId?.name ||
                          "Sem nome"}
                      </h3>

                      {showSensitiveData && (
                        <div className="space-y-2 text-sm text-gray-600">
                          {/* Email (campo padrão) */}
                          {(subscriber.fields?.email || subscriber.userId?.email) && (
                            <div className="flex items-center justify-center space-x-2">
                              <Mail className="h-4 w-4" />
                              <span>
                                {subscriber.fields?.email || subscriber.userId?.email}
                              </span>
                            </div>
                          )}
                          
                          {/* Campos customizados */}
                          {event.customFields?.map((customField) => 
                            renderCustomField(subscriber, customField)
                          )}
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-gray-500 mb-3">
                          Inscrito em{" "}
                          {formatDate(
                            new Date(subscriber.subscribedAt),
                            "dd/MM/yyyy 'às' HH:mm",
                            { locale: ptBR }
                          )}
                        </p>
                        
                        {/* Botão de Impressão */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPrintConfig(subscriber)}
                          className="flex items-center space-x-2 mx-auto"
                        >
                          <Printer className="h-4 w-4" />
                          <span>Imprimir</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={subscriber.userId?.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                          {getInitials(
                            subscriber.fields?.name ||
                              subscriber.userId?.name ||
                              "U"
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {subscriber.fields?.name ||
                            subscriber.userId?.name ||
                            "Sem nome"}
                        </h3>

                        {showSensitiveData && (
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            {/* Email (campo padrão) */}
                            {(subscriber.fields?.email || subscriber.userId?.email) && (
                              <span className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">
                                  {subscriber.fields?.email || subscriber.userId?.email}
                                </span>
                              </span>
                            )}
                            
                            {/* Campos customizados */}
                            {event.customFields?.map((customField) => 
                              renderCustomFieldList(subscriber, customField)
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {formatDate(
                              new Date(subscriber.subscribedAt),
                              "dd/MM/yyyy",
                              { locale: ptBR }
                            )}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(
                              new Date(subscriber.subscribedAt),
                              "HH:mm",
                              { locale: ptBR }
                            )}
                          </p>
                        </div>
                        
                        {/* Botão de Impressão */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openPrintConfig(subscriber)}
                          className="flex items-center space-x-2"
                        >
                          <Printer className="h-3 w-3" />
                          <span>Imprimir</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Configuração de Impressão */}
      {showPrintModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Configurar Impressão de Credencial
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrintModal(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informações do Participante */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Participante: {selectedSubscriber.fields?.name || selectedSubscriber.userId?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedSubscriber.fields?.email || selectedSubscriber.userId?.email}
                </p>
              </div>

              {/* Seleção de Campos */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Campos para Imprimir</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event?.customFields?.map((field) => (
                    <div key={field._id} className="flex items-center space-x-2">
                      <Checkbox
                        id={field.label}
                        checked={printConfig.selectedFields.includes(field.label)}
                        onCheckedChange={() => toggleFieldSelection(field.label)}
                      />
                      <Label htmlFor={field.label} className="text-sm">
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configurações de Papel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tipo de Impressão</Label>
                  <Select
                    value={printConfig.paperSize === "thermal" ? "thermal" : "credential"}
                    onValueChange={(value: "thermal" | "credential") => {
                      if (value === "thermal") {
                        // Para impressão térmica, manter os campos selecionados mas mudar o tamanho
                        setPrintConfig(prev => ({ 
                          ...prev, 
                          paperSize: "thermal" // Tamanho padrão para térmica
                        }));
                      } else {
                        // Para credencial, manter os campos selecionados mas mudar o tamanho
                        setPrintConfig(prev => ({ 
                          ...prev, 
                          paperSize: "A6" // Tamanho padrão para credencial
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thermal">Impressão Térmica (1 campo)</SelectItem>
                      <SelectItem value="credential">Credencial Completa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Tamanho do Papel</Label>
                  <Select
                    value={printConfig.paperSize}
                    onValueChange={(value: "A4" | "A5" | "A6" | "thermal" | "custom") =>
                      setPrintConfig(prev => ({ ...prev, paperSize: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A4">A4 (210 x 297mm)</SelectItem>
                      <SelectItem value="A5">A5 (148 x 210mm)</SelectItem>
                      <SelectItem value="A6">A6 (105 x 148mm)</SelectItem>
                      <SelectItem value="thermal">Térmica (80 x 120mm)</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Tamanho da Fonte</Label>
                <Select
                  value={printConfig.fontSize}
                  onValueChange={(value: "small" | "medium" | "large") =>
                    setPrintConfig(prev => ({ ...prev, fontSize: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Pequena</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dimensões Personalizadas */}
              {printConfig.paperSize === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Largura (mm)</Label>
                    <Input
                      type="number"
                      value={printConfig.customWidth}
                      onChange={(e) =>
                        setPrintConfig(prev => ({ ...prev, customWidth: parseInt(e.target.value) || 105 }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Altura (mm)</Label>
                    <Input
                      type="number"
                      value={printConfig.customHeight}
                      onChange={(e) =>
                        setPrintConfig(prev => ({ ...prev, customHeight: parseInt(e.target.value) || 148 }))
                      }
                    />
                  </div>
                </div>
              )}

              {/* Opções Adicionais */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showEventInfo"
                    checked={printConfig.showEventInfo}
                    onCheckedChange={(checked) =>
                      setPrintConfig(prev => ({ ...prev, showEventInfo: checked as boolean }))
                    }
                  />
                  <Label htmlFor="showEventInfo" className="text-sm">
                    Mostrar informações do evento
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showTimestamp"
                    checked={printConfig.showTimestamp}
                    onCheckedChange={(checked) =>
                      setPrintConfig(prev => ({ ...prev, showTimestamp: checked as boolean }))
                    }
                  />
                  <Label htmlFor="showTimestamp" className="text-sm">
                    Mostrar data/hora de geração
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t">
              <Button
                variant="outline"
                onClick={() => setShowPrintModal(false)}
              >
                Cancelar
              </Button>
                             <Button
                 onClick={() => {
                   printSubscriberData(selectedSubscriber, printConfig);
                   setShowPrintModal(false);
                 }}
                 className="flex items-center space-x-2"
               >
                 <Printer className="h-4 w-4" />
                 <span>
                   {printConfig.paperSize === "thermal" 
                     ? "Imprimir Térmica" 
                     : "Imprimir Credencial"
                   }
                 </span>
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
