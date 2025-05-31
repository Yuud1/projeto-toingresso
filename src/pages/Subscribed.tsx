import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download } from "lucide-react";

interface SubscribedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: string | null;
}

export default function Subscribed({
  open,
  onOpenChange,
  qrCode,
}: SubscribedProps) {
  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "ticket-qrcode.png";
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            <DialogTitle className="text-2xl">Inscrição Confirmada! 🎉</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Mostre este QR Code na entrada do evento para validar seu ticket.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center gap-4">
          {qrCode ? (
            <img
              src={qrCode}
              alt="QR Code do ticket"
              className="w-52 h-52 border rounded-lg shadow-md"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Gerando seu QR Code...
            </p>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={handleDownload}
            disabled={!qrCode}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Baixar QR Code
          </Button>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
