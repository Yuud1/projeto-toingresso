import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanEye, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"
import axios from "axios"
import { Badge } from "@/components/ui/badge"

export default function EventScanner() {
  // Estados para o scanner QR
  const [scannerToken, setScannerToken] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [scannerError, setScannerError] = useState("")
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null)
  const [scanned, setScanned] = useState(false)
  const qrCodeRegionId = "qr-code-region"
  const isScanning = useRef(false)

  // Funções do scanner QR
  const startScanner = () => {
    const qrElement = document.getElementById(qrCodeRegionId)
    if (!qrElement) {
      console.error(`Elemento com id=${qrCodeRegionId} não encontrado.`)
      return
    }

    // Se já existe um scanner, pare e limpe antes de criar um novo
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          scanner.clear()
          setScanner(null)
          createAndStartScanner()
        })
        .catch((err) => {
          console.error("Erro ao parar scanner existente:", err)
          createAndStartScanner()
        })
    } else {
      createAndStartScanner()
    }
  }

  const createAndStartScanner = () => {
    setScanned(false)
    const html5QrCode = new Html5Qrcode(qrCodeRegionId)
    setScanner(html5QrCode)

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    }

    html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (!isScanning.current) {
            isScanning.current = true
            html5QrCode
              .stop()
              .then(() => {
                html5QrCode.clear()
                setScanner(null)
                setScanned(true)
                setScanResult(decodedText)
              })
              .catch((err) => {
                setScanned(false)
                console.error("Erro ao parar scanner após leitura:", err)
              })
          }
        },
        () => {
        },
      )
      .catch(() => {
        setScanned(false)
        setScannerError("Falha ao iniciar a câmera. Verifique as permissões de acesso e recarregue a página.")
      })
  }

  const stopScanner = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          scanner.clear()
          setScanner(null)
          isScanning.current = false
        })
        .catch((err) => {
          console.error("Erro ao parar scanner:", err)
        })
    }
  }

  const resetScanner = () => {
    setScanResult(null)
    isScanning.current = false
    stopScanner()
    startScanner()
  }

  const validateToken = async () => {
    if (!scannerToken.trim()) {
      setScannerError("Por favor, insira um token")
      return
    }

    setIsLoading(true)
    setScannerError("")

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_VALIDATE_TICKET_TOKEN}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${scannerToken}`,
          },
        },
      )

      if (response.data.validated) {
        setIsAuthenticated(true)
        setScannerError("")
        sessionStorage.setItem("validationToken", response.data.validationToken)
      }
    } catch (err: any) {
      setScannerError(err.response?.data?.message || "Erro ao validar token")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    stopScanner()
    setIsAuthenticated(false)
    setScannerToken("")
    setScanResult(null)
    setScanner(null)
    sessionStorage.removeItem("validationToken")
  }

  useEffect(() => {
    if (isAuthenticated && scanResult === null) {
      startScanner()
    }

    return () => {
      stopScanner()
    }
  }, [isAuthenticated, scanResult])

  useEffect(() => {
    if (scanned && scanResult) {
      const sendQrResult = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_EVENT_SCAN_TICKET}`,
            { dispositiveToken: sessionStorage.getItem("validationToken") },
            { headers: { Authorization: `Bearer ${scanResult}` } },
          )
          if (response.data.message) {
            setScanResult(response.data.message)
          }
        } catch (error: any) {
          if (error.response?.data?.message) {
            setScanResult(error.response.data.message)
          } else {
            setScanResult("Ocorreu um erro ao validar o ticket.")
          }
          console.log("Erro ao enviar requisição qr", error)
        }
      }

      sendQrResult()
    }
  }, [scanned, scanResult])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Scanner de Ingressos</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanEye className="h-5 w-5" />
            Leitor QR Code
          </CardTitle>
          <CardDescription>Escaneie os QR Codes dos ingressos para validar a entrada.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[60vh] flex items-center justify-center p-4">
            {!isAuthenticated ? (
              <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Acesso ao Scanner</CardTitle>
                  <CardDescription>Insira seu token para acessar o scanner de QR code.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token">Token de Acesso</Label>
                    <Input
                      id="token"
                      type="password"
                      placeholder="Digite seu token"
                      value={scannerToken}
                      onChange={(e) => setScannerToken(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && validateToken()}
                    />
                  </div>

                  {scannerError && (
                    <Alert variant="destructive">
                      <AlertDescription>{scannerError}</AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={validateToken} disabled={isLoading} className="w-full">
                    {isLoading ? "Validando..." : "Acessar Scanner"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-center text-xl">Leitor de QR Code</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  {!scanResult ? (
                    <>
                      <div id={qrCodeRegionId} className="w-full" style={{ minHeight: "250px" }} />
                      <p className="text-muted-foreground text-sm">Aponte sua câmera para um QR Code</p>
                      {scannerError && (
                        <Alert variant="destructive">
                          <AlertDescription>{scannerError}</AlertDescription>
                        </Alert>
                      )}
                      <Button variant="outline" onClick={stopScanner} className="w-full">
                        Parar Scanner
                      </Button>
                      <Button variant="destructive" onClick={logout} className="w-full">
                        Sair
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-center">
                      <Badge variant="secondary">Resultado do Scan</Badge>
                      <p className="break-words text-lg font-medium p-4">{scanResult}</p>
                      <Button variant="outline" onClick={resetScanner} className="w-full">
                        Ler Novamente
                      </Button>
                      <Button variant="destructive" onClick={logout} className="w-full">
                        Sair
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}