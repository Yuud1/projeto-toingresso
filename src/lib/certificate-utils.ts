export interface CertificateConfig {
  width: number
  height: number
  dpi: number
  format: "A4" | "Letter" | "Custom"
}

export const defaultConfig: CertificateConfig = {
  width: 1200,
  height: 800,
  dpi: 300,
  format: "A4",
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export const generateCertificateId = (): string => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `CERT-${timestamp}-${random}`.toUpperCase()
}

export const validateCertificateData = (data: any): string[] => {
  const errors: string[] = []

  if (!data.studentName?.trim()) {
    errors.push("Nome do estudante é obrigatório")
  }

  if (!data.courseName?.trim()) {
    errors.push("Nome do curso é obrigatório")
  }

  if (!data.totalHours || data.totalHours <= 0) {
    errors.push("Carga horária deve ser maior que zero")
  }

  if (!data.completionDate) {
    errors.push("Data de conclusão é obrigatória")
  }

  return errors
}

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
  const link = document.createElement("a")
  link.download = filename
  link.href = canvas.toDataURL("image/png", 1.0)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
