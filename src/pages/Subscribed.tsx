import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Eye, Ticket } from "lucide-react";
import axios from "axios";
import { useState } from "react";

interface SubscribedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: string | null;
  ticketId?: string;
}

export default function Subscribed({
  open,
  onOpenChange,
  qrCode,
  ticketId,
}: SubscribedProps) {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_GET_TICKET_PDF
        }/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { pdfBuffer, fileName } = response.data;

      // Converter o objeto pdfBuffer em um array de bytes
      const byteArray = new Uint8Array(Object.values(pdfBuffer));

      // Criar o Blob a partir do array de bytes
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Criar a URL e iniciar o download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || "ticket.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar PDF", error);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-xl border-0 p-0 overflow-hidden">
        {/* Header com cores da marca */}
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-6 text-white relative overflow-hidden">
          {/* Padrão decorativo */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <Ticket className="w-full h-full rotate-12" />
          </div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Visualizar Ticket
                </DialogTitle>
                <DialogDescription className="text-blue-100 mt-1 font-medium">
                  QR Code do seu ingresso
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="p-2 bg-blue-400 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-blue-900">Ticket Válido</p>
              <p className="text-sm text-blue-800">
                Mostre este QR Code na entrada do evento para validar seu ticket
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4">
            {qrCode ? (
              <div className="p-4 bg-white border-2 border-blue-200 rounded-lg shadow-lg">
                <img
                  src={qrCode}
                  alt="QR Code do ticket"
                  className="w-52 h-52 rounded-lg"
                />
              </div>
            ) : (
              <div className="p-8 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  Gerando seu QR Code...
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 flex gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloadingPdf ? "Baixando Pdf" : "Baixar Pdf QR Code"}
          </Button>

          <Button
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Eye className="mr-2 h-4 w-4" />
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
