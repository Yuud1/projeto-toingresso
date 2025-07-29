import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Minus, Plus } from "lucide-react";
import TicketInterface from "@/interfaces/TicketInterface";
import axios from "axios";
import EventInterface from "@/interfaces/EventInterface";
import { formatDate } from "date-fns";
import { truncateTextTo30Chars } from "@/utils/formatUtils";

interface TicketSelectorProps {
  event: EventInterface
  tickets: TicketInterface[];  
}

export function TicketSelector({
  event,
  tickets,
}: TicketSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: string]: number;
  }>({});  
  const [loadingBuyButton, setLoadingBuyButton] = useState(false);
  
  const handleQuantityChange = (ticket_id: string, change: number) => {
    setSelectedTickets((prev) => {
      const currentQuantity = prev[ticket_id] || 0;
      const maxQuantity =
        tickets.find((t) => t._id === ticket_id)?.quantity || 0;
      const newQuantity = Math.max(
        0,
        Math.min(maxQuantity, currentQuantity + change)
      );

      if (newQuantity === 0) {
        const { [ticket_id]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [ticket_id]: newQuantity };
    });
  };

  const totalTickets = Object.values(selectedTickets).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
  const totalPrice = Object.entries(selectedTickets).reduce(
    (sum, [ticket_id, quantity]) => {
      const ticket = tickets.find((t) => t._id === ticket_id);
      return sum + (ticket?.price || 0) * quantity;
    },
    0
  );

  const handleSubmit = async () => {
    try {
      if (!localStorage.getItem('token')) {
        window.location.href = "/login"
      }
      
      setLoadingBuyButton(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_EVENT_PAY}`,
        {selectedTickets, eventId: event._id},
        {
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.data.init_point) {
        window.location.href = response.data.init_point
      }
      
    } catch (error: any) {
      console.log("Erro ao realizar pagamento", error);

      if (error.response.data.logged === false) {
        window.location.href = "/login"
      }
    } finally{
      setLoadingBuyButton(false)
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {tickets.map((ticket) => {
          const maxInstallments = ticket.maxInstallments || 1;
          const total = ticket.price + (ticket.fee || 0);
          const installmentValue = maxInstallments > 1 ? total / maxInstallments : total;
          const isSoldOut = ticket.soldQuantity >= ticket.quantity;
          return (
            <div
              key={ticket._id}
              className={`flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white/90 shadow-sm ${isSoldOut ? "opacity-60 grayscale" : ""}`}
            >
              <div className="space-y-1">
                <div className="text-base font-bold text-gray-700">
                  {ticket.name}
                </div>
                {isSoldOut ? (
                  <div className="text-sm font-bold text-red-500">Esgotado</div>
                ) : (
                  <div className="text-sm font-normal text-[#02488C]">
                    R$ {ticket.price.toFixed(2)}
                    {ticket.fee ? (
                      <span className="text-gray-400 text-xs font-normal"> (+ R$ {ticket.fee.toFixed(2)} taxa)</span>
                    ) : null}
                  </div>
                )}
                {!isSoldOut && (
                  <div className="text-sm font-bold text-green-600">
                    em até {maxInstallments}x R$ {installmentValue.toFixed(2)}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  Vendas até {formatDate(event.batches[0].saleEnd, "dd/MM/yyyy")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(ticket._id ?? "", -1)}
                  disabled={isSoldOut || !selectedTickets[ticket._id ?? ""]}
                  className="border border-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold text-base">
                  {selectedTickets[ticket._id ?? ""] || 0}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(ticket._id ?? "", 1)}
                  disabled={isSoldOut || selectedTickets[ticket._id ?? ""] >= ticket.quantity}
                  className="border border-gray-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full bg-[#FEC800] text-black hover:bg-[#e5b700] font-semibold cursor-pointer"
            disabled={totalTickets === 0}
          >
            {totalTickets > 0
              ? `Comprar ${totalTickets} ingresso${
                  totalTickets > 1 ? "s" : ""
                } - R$ ${totalPrice.toFixed(2)}`
              : "Selecione os ingressos"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          {/* Ingresso visual moderno retangular */}
          <div className="w-full flex items-stretch rounded-xl overflow-hidden border border-gray-200 shadow bg-white mb-4 relative mt-8">
            {/* Recorte de ticket (opcional) */}
            <div className="absolute left-0 top-6 bottom-6 w-4 flex flex-col justify-between z-10">
              <div className="w-4 h-4 bg-white rounded-full border border-gray-200 -ml-2"></div>
              <div className="w-4 h-4 bg-white rounded-full border border-gray-200 -ml-2"></div>
            </div>
            <img
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              className="h-28 sm:h-32 w-28 sm:w-32 object-cover border-r border-gray-200 flex-shrink-0"
            />
            <div className="flex-1 p-4 flex flex-col justify-center">
              <div className="text-base font-bold text-gray-700 mb-1 truncate">{truncateTextTo30Chars(event.title)}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <span>{event.neighborhood}</span>
                <span>•</span>
                <span>{event.city}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span>{event.dates[0]?.startDate && new Date(event.dates[0].startDate).toLocaleDateString("pt-BR")}</span>
                <span>às</span>
                <span>{event.dates[0]?.startTime?.slice(0, 5)}</span>
              </div>
              {Object.entries(selectedTickets).map(([ticket_id, quantity]) => {
                const ticket = tickets.find((t) => t._id === ticket_id);
                if (!ticket) return null;
                return (
                  <div key={ticket_id} className="flex justify-between text-xs text-gray-700">
                    <span>{ticket.name} x {quantity}</span>
                    <span>R$ {(ticket.price * quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>
              Você está prestes a adquirir {totalTickets} ingresso
              {totalTickets > 1 ? "s" : ""} para <strong>{truncateTextTo30Chars(event.title)}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {Object.entries(selectedTickets).map(([ticket_id, quantity]) => {
              const ticket = tickets.find((t) => t._id === ticket_id);
              return (
                <div key={ticket_id} className="flex justify-between text-sm">
                  <span>
                    {ticket?.name} x {quantity}
                  </span>
                  <span>R$ {(ticket?.price || 0) * quantity}</span>
                </div>
              );
            })}
            <div className="border-t pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#FEC800] text-black hover:bg-[#e5b700] cursor-pointer"
              onClick={handleSubmit}
              disabled={loadingBuyButton}
            >
              Confirmar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
