import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileImage, Loader2, Award, Calendar, User, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CertificateData {
  studentName: string
  courseName: string
  totalHours: number
  completionDate: string
  instructorName: string
  institution: string
  courseDescription: string
  certificateId: string
  template: string
}

export default function CertificateGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [certificateData, setCertificateData] = useState<CertificateData>({
    studentName: "",
    courseName: "",
    totalHours: 0,
    completionDate: new Date().toISOString().split("T")[0],
    instructorName: "",
    institution: "",
    courseDescription: "",
    certificateId: "",
    template: "modern",
  })

  const { toast } = useToast()

  const [isGenerating, setIsGenerating] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [baseImage, setBaseImage] = useState<HTMLImageElement | null>(null)

  const templates = [
    { id: "modern", name: "Moderno", description: "Design limpo e contemporâneo" },
    { id: "classic", name: "Clássico", description: "Estilo tradicional e elegante" },
    { id: "minimal", name: "Minimalista", description: "Design simples e focado" },
    { id: "elegant", name: "Elegante", description: "Sofisticado com detalhes dourados" },
  ]

  // Gerar ID único para o certificado
  const generateCertificateId = () => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `CERT-${timestamp}-${random}`.toUpperCase()
  }

  // Carregar imagem base do template
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => setBaseImage(img)
    img.src = `/placeholder.svg?height=600&width=800&text=Certificate+Template`

    // Gerar ID se não existir
    if (!certificateData.certificateId) {
      setCertificateData((prev) => ({
        ...prev,
        certificateId: generateCertificateId(),
      }))
    }
  }, [certificateData.template])

  // Desenhar certificado no canvas
  const drawCertificate = () => {
    const canvas = canvasRef.current
    if (!canvas || !baseImage) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar canvas
    canvas.width = 1200
    canvas.height = 800

    // Desenhar fundo baseado no template
    drawBackground(ctx, certificateData.template)

    // Configurar fonte e cores
    ctx.textAlign = "center"
    ctx.fillStyle = "#1a1a1a"

    // Título principal
    ctx.font = "bold 48px serif"
    ctx.fillText("CERTIFICADO DE CONCLUSÃO", canvas.width / 2, 120)

    // Linha decorativa
    ctx.strokeStyle = "#d4af37"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(200, 150)
    ctx.lineTo(1000, 150)
    ctx.stroke()

    // Texto "Certificamos que"
    ctx.font = "24px serif"
    ctx.fillStyle = "#666"
    ctx.fillText("Certificamos que", canvas.width / 2, 200)

    // Nome do estudante
    ctx.font = "bold 36px serif"
    ctx.fillStyle = "#1a1a1a"
    ctx.fillText(certificateData.studentName || "[Nome do Estudante]", canvas.width / 2, 260)

    // Linha sob o nome
    ctx.strokeStyle = "#1a1a1a"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(300, 280)
    ctx.lineTo(900, 280)
    ctx.stroke()

    // Texto "concluiu com êxito o curso"
    ctx.font = "24px serif"
    ctx.fillStyle = "#666"
    ctx.fillText("concluiu com êxito o curso", canvas.width / 2, 320)

    // Nome do curso
    ctx.font = "bold 32px serif"
    ctx.fillStyle = "#1a1a1a"
    ctx.fillText(certificateData.courseName || "[Nome do Curso]", canvas.width / 2, 370)

    // Descrição do curso (se houver)
    if (certificateData.courseDescription) {
      ctx.font = "18px sans-serif"
      ctx.fillStyle = "#666"
      const maxWidth = 800
      wrapText(ctx, certificateData.courseDescription, canvas.width / 2, 410, maxWidth, 25)
    }

    // Informações do curso
    ctx.font = "20px sans-serif"
    ctx.fillStyle = "#1a1a1a"
    ctx.fillText(`Carga Horária: ${certificateData.totalHours}h`, canvas.width / 2, 480)
    ctx.fillText(
      `Data de Conclusão: ${new Date(certificateData.completionDate).toLocaleDateString("pt-BR")}`,
      canvas.width / 2,
      510,
    )

    // Assinatura e instituição
    ctx.font = "18px serif"
    ctx.fillStyle = "#666"
    ctx.textAlign = "left"
    ctx.fillText(certificateData.instructorName || "[Instrutor]", 200, 650)
    ctx.fillText("Instrutor", 200, 670)

    ctx.textAlign = "right"
    ctx.fillText(certificateData.institution || "[Instituição]", 1000, 650)
    ctx.fillText("Instituição", 1000, 670)

    // ID do certificado
    ctx.textAlign = "center"
    ctx.font = "14px monospace"
    ctx.fillStyle = "#999"
    ctx.fillText(`ID: ${certificateData.certificateId}`, canvas.width / 2, 750)
  }

  // Desenhar fundo baseado no template
  const drawBackground = (ctx: CanvasRenderingContext2D, template: string) => {
    const canvas = ctx.canvas

    switch (template) {
      case "modern": {
        // Gradiente moderno
        const modernGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        modernGradient.addColorStop(0, "#f8fafc")
        modernGradient.addColorStop(1, "#e2e8f0")
        ctx.fillStyle = modernGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Bordas modernas
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 8
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)
        break
      }

      case "classic": {
        // Fundo clássico
        ctx.fillStyle = "#fefefe"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Bordas ornamentadas
        ctx.strokeStyle = "#8b5a2b"
        ctx.lineWidth = 12
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60)
        ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)
        break
      }

      case "minimal": {
        // Fundo minimalista
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Borda simples
        ctx.strokeStyle = "#374151"
        ctx.lineWidth = 2
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100)
        break
      }

      case "elegant": {
        const elegantGradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2,
        )
        elegantGradient.addColorStop(0, "#fefefe")
        elegantGradient.addColorStop(1, "#f3f4f6")
        ctx.fillStyle = elegantGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Bordas douradas
        ctx.strokeStyle = "#d4af37"
        ctx.lineWidth = 6
        ctx.strokeRect(25, 25, canvas.width - 50, canvas.height - 50)
        break
      }
    }
  }

  // Função para quebrar texto em múltiplas linhas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
  ) => {
    const words = text.split(" ")
    let line = ""
    let currentY = y

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " "
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY)
        line = words[n] + " "
        currentY += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, currentY)
  }

  // Atualizar preview quando dados mudarem
  useEffect(() => {
    if (previewMode) {
      drawCertificate()
    }
  }, [certificateData, previewMode, baseImage])

  // Gerar certificado via API
  const generateCertificate = async () => {
    setIsGenerating(true)

    try {
      // Simular chamada de API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Certificado gerado com sucesso!",
        description: `ID: ${certificateData.certificateId}`,
      })

      // Desenhar e mostrar preview
      setPreviewMode(true)
      setTimeout(() => drawCertificate(), 100)
    } catch (error) {
      toast({
        title: "Erro ao gerar certificado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Download do certificado
  const downloadCertificate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `certificado-${certificateData.studentName.replace(/\s+/g, "-").toLowerCase()}-${certificateData.certificateId}.png`
    link.href = canvas.toDataURL()
    link.click()

    toast({
      title: "Download iniciado!",
      description: "O certificado está sendo baixado.",
    })
  }

  const handleInputChange = (field: keyof CertificateData, value: string | number) => {
    setCertificateData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const isFormValid = certificateData.studentName && certificateData.courseName && certificateData.totalHours > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Dados do Certificado
              </CardTitle>
              <CardDescription>Preencha as informações para gerar o certificado</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações do Estudante */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <Label className="text-sm font-semibold">Informações do Estudante</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentName">Nome Completo *</Label>
                  <Input
                    id="studentName"
                    placeholder="Digite o nome completo do estudante"
                    value={certificateData.studentName}
                    onChange={(e) => handleInputChange("studentName", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Informações do Curso */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <Label className="text-sm font-semibold">Informações do Curso</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseName">Nome do Curso *</Label>
                    <Input
                      id="courseName"
                      placeholder="Ex: Desenvolvimento Web"
                      value={certificateData.courseName}
                      onChange={(e) => handleInputChange("courseName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalHours">Carga Horária *</Label>
                    <Input
                      id="totalHours"
                      type="number"
                      placeholder="40"
                      value={certificateData.totalHours || ""}
                      onChange={(e) => handleInputChange("totalHours", Number.parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseDescription">Descrição do Curso</Label>
                  <Textarea
                    id="courseDescription"
                    placeholder="Breve descrição do conteúdo do curso..."
                    value={certificateData.courseDescription}
                    onChange={(e) => handleInputChange("courseDescription", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Informações Adicionais */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <Label className="text-sm font-semibold">Informações Adicionais</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="completionDate">Data de Conclusão</Label>
                    <Input
                      id="completionDate"
                      type="date"
                      value={certificateData.completionDate}
                      onChange={(e) => handleInputChange("completionDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template">Template</Label>
                    <Select
                      value={certificateData.template}
                      onValueChange={(value) => handleInputChange("template", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-sm text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructorName">Nome do Instrutor</Label>
                    <Input
                      id="instructorName"
                      placeholder="Nome do instrutor"
                      value={certificateData.instructorName}
                      onChange={(e) => handleInputChange("instructorName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Instituição</Label>
                    <Input
                      id="institution"
                      placeholder="Nome da instituição"
                      value={certificateData.institution}
                      onChange={(e) => handleInputChange("institution", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* ID do Certificado */}
              <div className="space-y-2">
                <Label>ID do Certificado</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {certificateData.certificateId}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange("certificateId", generateCertificateId())}
                  >
                    Gerar Novo
                  </Button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4">
                <Button onClick={generateCertificate} disabled={!isFormValid || isGenerating} className="flex-1">
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Gerar Certificado
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setPreviewMode(!previewMode)
                    if (!previewMode) {
                      setTimeout(() => drawCertificate(), 100)
                    }
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {previewMode ? "Ocultar" : "Preview"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview do Certificado */}
          {previewMode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Preview do Certificado</span>
                  <Button onClick={downloadCertificate} size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardTitle>
                <CardDescription>Visualização do certificado gerado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white">
                  <canvas ref={canvasRef} className="w-full h-auto" style={{ maxWidth: "100%", height: "auto" }} />
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Informações do Certificado:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Estudante:</strong> {certificateData.studentName || "Não informado"}
                    </div>
                    <div>
                      <strong>Curso:</strong> {certificateData.courseName || "Não informado"}
                    </div>
                    <div>
                      <strong>Carga Horária:</strong> {certificateData.totalHours}h
                    </div>
                    <div>
                      <strong>Template:</strong> {templates.find((t) => t.id === certificateData.template)?.name}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
