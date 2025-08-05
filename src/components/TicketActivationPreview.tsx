import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { canActivateTicket, getActivationStatusMessage, formatActivationDate } from '@/utils/ticketValidation';
import TicketInterface from '@/interfaces/TicketInterface';

interface TicketActivationPreviewProps {
  ticket: TicketInterface;
  eventStartDate?: string;
  eventEndDate?: string;
}

export default function TicketActivationPreview({ 
  ticket, 
  eventStartDate, 
  eventEndDate 
}: TicketActivationPreviewProps) {
  const canActivate = canActivateTicket(ticket);
  const statusMessage = getActivationStatusMessage(ticket);

  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">Preview: {ticket.name}</span>
          <Badge 
            variant={canActivate ? "default" : "secondary"}
            className={canActivate ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
          >
            {canActivate ? (
              <CheckCircle className="w-4 h-4 mr-1" />
            ) : (
              <XCircle className="w-4 h-4 mr-1" />
            )}
            {canActivate ? "Pode Ativar" : "Aguardando"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações do Ingresso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Informações do Ingresso</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nome:</span>
                <span className="font-medium">{ticket.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Preço:</span>
                <span className="font-medium">R$ {ticket.price.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantidade:</span>
                <span className="font-medium">{ticket.quantity}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Configuração de Ativação</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Ativação:</span>
                <span className="font-medium">
                  {ticket.activateAt ? formatActivationDate(ticket.activateAt) : "Ativação livre"}
                </span>
              </div>
              {eventStartDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Início do Evento:</span>
                  <span className="font-medium">
                    {new Date(eventStartDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
              {eventEndDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fim do Evento:</span>
                  <span className="font-medium">
                    {new Date(eventEndDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status de Ativação */}
        <div className={`p-4 rounded-lg border ${
          canActivate 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-start gap-3">
            {canActivate ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h5 className={`font-medium mb-1 ${
                canActivate ? 'text-green-900' : 'text-yellow-900'
              }`}>
                Status de Ativação
              </h5>
              <p className={`text-sm ${
                canActivate ? 'text-green-700' : 'text-yellow-700'
              }`}>
                {statusMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Exemplos de Uso */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">Exemplos de Uso</h5>
          <div className="space-y-2 text-sm text-gray-700">
            {!ticket.activateAt ? (
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Ingresso para todos os dias - pode ser ativado a qualquer momento</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Ingresso específico - só pode ser ativado a partir da data definida</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Controle de acesso por horário - útil para eventos com múltiplos dias</span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 