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


interface TicketSelectorProps {
  eventTitle: string;
  tickets: TicketInterface[];
}

export function TicketSelector({ eventTitle, tickets }: TicketSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<{
    [key: string]: number;
  }>({});

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="flex items-center justify-between p-4 border rounded-lg cursor-pointer"
          >
            <div className="space-y-1">
              <h3 className="font-semibold">{ticket.name}</h3>
              <p className="text-sm text-gray-600">{ticket.description}</p>
              <p className="text-sm text-gray-600">
                Disponíveis: {ticket.quantity}
              </p>
            </div>
            <div className="flex items-center gap-4 flex-col sm:flex-row">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(ticket._id, -1)}
                  disabled={!selectedTickets[ticket._id]}
                  className="cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">
                  {selectedTickets[ticket._id] || 0}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(ticket._id, 1)}
                  disabled={selectedTickets[ticket._id] >= ticket.quantity}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="font-semibold">
                R$ {ticket.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
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
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
            <DialogDescription>
              Você está prestes a adquirir {totalTickets} ingresso
              {totalTickets > 1 ? "s" : ""} para <strong>{eventTitle}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {Object.entries(selectedTickets).map(([ticket_id, quantity]) => {
              const ticket = tickets.find((t) => t._id === (ticket_id));
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
            <Button className="bg-[#FEC800] text-black hover:bg-[#e5b700] cursor-pointer">
              Confirmar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
