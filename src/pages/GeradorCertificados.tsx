import React, { useState } from "react"
import type EventInterface from "@/interfaces/EventInterface"
import type { EventParticipant } from "./MyEvents"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Award, Upload, UserCheck, Calendar } from "lucide-react"

interface CertificateGeneratorProps {
  events: EventInterface[]
  participants: EventParticipant[]
}

export default function CertificateGenerator({ events, participants }: CertificateGeneratorProps) {
  const { toast } = useToast()
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [pdfTemplate, setPdfTemplate] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        setPdfTemplate(file)
        toast({
          title: "PDF Carregado",
          description: `Arquivo "${file.name}" pronto para uso.`,
        })
      } else {
        setPdfTemplate(null)
        e.target.value = "" // Reset file input
        toast({
          title: "Formato de arquivo inválido",
          description: "Por favor, envie um arquivo no formato PDF.",
          variant: "destructive",
        })
      }
    }
  }

  const handleGenerate = async () => {
    if (!selectedEvent) {
      toast({ title: "Erro", description: "Por favor, selecione um evento.", variant: "destructive" })
      return
    }
    if (!pdfTemplate) {
      toast({
        title: "Erro",
        description: "Por favor, faça o upload do modelo de certificado em PDF.",
        variant: "destructive",
      })
      return
    }

    const authenticatedParticipants = participants.filter((p) => p.isAuthenticated)
    if (authenticatedParticipants.length === 0) {
      toast({
        title: "Nenhum participante encontrado",
        description: "Não há participantes autenticados neste evento para gerar certificados.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulação de chamada de API
    console.log("Iniciando geração de certificados para o evento:", selectedEvent)
    console.log("Usando o template:", pdfTemplate.name)
    console.log("Participantes:", authenticatedParticipants.map((p) => p.name))

    // Aqui você implementaria a lógica de upload para o backend
    // Ex:
    // const formData = new FormData();
    // formData.append('pdfTemplate', pdfTemplate);
    // formData.append('eventId', selectedEvent);
    // await axios.post('/api/generate-certificates', formData);

    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simula delay da API

    setIsGenerating(false)
    toast({
      title: "Geração de Certificados Iniciada!",
      description: `O processo para gerar ${authenticatedParticipants.length} certificados foi enviado ao servidor.`,
    })
  }

  const finishedEvents = events.filter((event) => event.status === "finished")
  const authenticatedParticipants = participants.filter((p) => p.isAuthenticated)

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Gerador de Certificados por PDF</CardTitle>
        <CardDescription>
          Siga os passos abaixo para gerar os certificados para os participantes de um evento encerrado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <Label htmlFor="eventSelect" className="text-lg flex items-center gap-2">
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
          <Label htmlFor="pdfUpload" className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Passo 2: Upload do Modelo PDF
          </Label>
          <Input id="pdfUpload" type="file" accept="application/pdf" onChange={handleFileChange} />
          {pdfTemplate && (
            <p className="text-sm text-muted-foreground">Arquivo selecionado: {pdfTemplate.name}</p>
          )}
        </div>

        {selectedEvent && (
          <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <UserCheck className="h-5 w-5 text-blue-600" />
              <span>Participantes para Geração</span>
            </div>
            {authenticatedParticipants.length > 0 ? (
              <>
                <p className="text-sm text-gray-600">
                  {authenticatedParticipants.length} participante(s) autenticado(s) receberá(ão) o certificado.
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
                  {authenticatedParticipants.map((p) => (
                    <div key={p.id} className="text-sm font-medium">
                      {p.name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm font-medium text-red-600">
                Não há participantes autenticados para este evento.
              </p>
            )}
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedEvent || !pdfTemplate}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando Certificados...
            </>
          ) : (
            <>
              <Award className="mr-2 h-4 w-4" /> Gerar {authenticatedParticipants.length > 0 ? `(${authenticatedParticipants.length})` : ''} Certificados
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}