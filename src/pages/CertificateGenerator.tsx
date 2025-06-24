import React, { useState } from "react";
import type EventInterface from "@/interfaces/EventInterface";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Award, Upload, Calendar } from "lucide-react";
import axios from "axios";
import { useUser } from "@/contexts/useContext";

interface CertificateGeneratorProps {
  events: EventInterface[];
}

export default function CertificateGenerator({
  events,
}: CertificateGeneratorProps) {
  const { toast } = useToast();
  const {user} = useUser()
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [pdfTemplate, setPdfTemplate] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setPdfTemplate(file);
        toast({
          title: "PDF Carregado",
          description: `Arquivo "${file.name}" pronto para uso.`,
        });
      } else {
        setPdfTemplate(null);
        e.target.value = ""; // Reset file input
        toast({
          title: "Formato de arquivo inválido",
          description: "Por favor, envie um arquivo no formato PDF.",
          variant: "destructive",
        });
      }
    }
  };

  const handleGenerate = async () => {
    if (!selectedEvent) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um evento.",
        variant: "destructive",
      });
      return;
    }
    if (!pdfTemplate) {
      toast({
        title: "Erro",
        description:
          "Por favor, faça o upload do modelo de certificado em PDF.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsGenerating(true);

      const formData = new FormData();
      formData.append("certificatePdf", pdfTemplate);
      formData.append("eventId", selectedEvent); 

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_EVENT_GENERATE_CERTIFICATE
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.sended) {
        // Se quiser exibir alguma coisa quando for enviado ou algum modal o estado tu coloca aqui
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTeste = async () => {
    if (!selectedEvent) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um evento.",
        variant: "destructive",
      });
      return;
    }
    if (!pdfTemplate) {
      toast({
        title: "Erro",
        description:
          "Por favor, faça o upload do modelo de certificado em PDF.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsGenerating(true);

      const formData = new FormData();
      formData.append("certificatePdf", pdfTemplate);
      formData.append("eventId", selectedEvent); 
      formData.append("userId", user?._id ?? ""); 

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_EVENT_GENERATE_CERTIFICATE_TEST
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.sended) {
        // Se quiser exibir alguma coisa quando for enviado ou algum modal o estado tu coloca aqui
      }
    } catch (error) {
    console.log(error)
    } finally {
      setIsGenerating(false);
    }
  };
  const finishedEvents = events.filter((event) => event.status === "finished");

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          Gerador de Certificados por PDF
        </CardTitle>
        <CardDescription>
          Siga os passos abaixo para gerar os certificados para os participantes
          de um evento encerrado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <Label
            htmlFor="eventSelect"
            className="text-lg flex items-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            Passo 1: Selecione o Evento
          </Label>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger id="eventSelect" className="w-full">
              <SelectValue placeholder="Escolha um evento encerrado..." />
            </SelectTrigger>
            <SelectContent>
              {finishedEvents.length > 0 ? (
                finishedEvents.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  Nenhum evento encerrado encontrado
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label
            htmlFor="pdfUpload"
            className="text-lg flex items-center gap-2"
          >
            <Upload className="h-5 w-5" />
            Passo 2: Upload do Modelo PDF
          </Label>
          <Input
            id="pdfUpload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          {pdfTemplate && (
            <p className="text-sm text-muted-foreground">
              Arquivo selecionado: {pdfTemplate.name}
            </p>
          )}
        </div>

       <div className="flex flex-col gap-5">
         <Button
          onClick={handleGenerateTeste}
          disabled={isGenerating || !selectedEvent || !pdfTemplate}
          className="w-full cursor-pointer"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando
              Certificado Teste
            </>
          ) : (
            <>
              <Award className="mr-2 h-4 w-4" /> Gerar Certificado Teste
            </>
          )}
        </Button>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedEvent || !pdfTemplate}
          className="w-full cursor-pointer"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando
              Certificados...
            </>
          ) : (
            <>
              <Award className="mr-2 h-4 w-4" /> Gerar Todos os Certificados
            </>
          )}
        </Button>
       </div>
      </CardContent>
    </Card>
  );
}
