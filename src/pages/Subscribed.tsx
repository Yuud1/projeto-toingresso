import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SubscribedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: string | null;
}

export default function Subscribed({ open, onOpenChange, qrCode }: SubscribedProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inscrição Confirmada! 🎉</DialogTitle>
          <DialogDescription>
            Mostre este QR Code na entrada do evento para validar seu ticket.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4">
          {qrCode ? (
            <img
              src={qrCode}
              alt="QR Code do ticket"
              className="w-52 h-52"
            />
          ) : (
            <p>Gerando QR Code...</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
