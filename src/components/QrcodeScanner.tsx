import { useState, useRef, useEffect } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function QRScanner() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [scanned, setScanned] = useState(false);
  const qrCodeRegionId = "qr-code-region";
  const isScanning = useRef(false);

  const startScanner = () => {
    const qrElement = document.getElementById(qrCodeRegionId);
    if (!qrElement) {
      console.error(`Elemento com id=${qrCodeRegionId} não encontrado.`);
      setError("Erro interno. Elemento não encontrado.");
      return;
    }

    // Se já existe um scanner, para e limpa antes de iniciar outro
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          scanner.clear();
          setScanner(null);
          createAndStartScanner();
        })
        .catch((err) => {
          console.error("Erro ao parar scanner existente:", err);
          createAndStartScanner(); // Tenta iniciar mesmo que pare falhe
        });
    } else {
      createAndStartScanner();
    }
  };

  const createAndStartScanner = async () => {
    try {
      // ✅ Solicita permissão da câmera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Fecha o stream imediatamente, pois só foi usado para obter permissão
      stream.getTracks().forEach((track) => track.stop());

      setScanned(false);
      setError("");

      const html5QrCode = new Html5Qrcode(qrCodeRegionId);
      setScanner(html5QrCode);

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (!isScanning.current) {
            isScanning.current = true;

            console.log(`QR Code detectado: ${decodedText}`);
            setResult(decodedText);
            setScanned(true);

            html5QrCode
              .stop()
              .then(() => {
                html5QrCode.clear();
                setScanner(null);
              })
              .catch((err) => {
                console.error("Erro ao parar scanner após leitura:", err);
              });
          }
        },
        (errorMessage) => {
          // ❗ Pode ignorar pequenos erros de decodificação
          console.warn(`Erro de decodificação: ${errorMessage}`);
        }
      );
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
      setError(
        "Não foi possível acessar a câmera. Verifique as permissões do navegador."
      );
      setScanned(false);
    }
  };

  const stopScanner = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          scanner.clear();
          setScanner(null);
          isScanning.current = false;
          console.log("Scanner parado manualmente.");
        })
        .catch((err) => {
          console.error("Erro ao parar scanner:", err);
        });
    }
  };

  const resetScanner = () => {
    setResult(null);
    isScanning.current = false;
    stopScanner();
    startScanner();
  };

  const validateToken = async () => {
    if (!token.trim()) {
      setError("Por favor, insira um token");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_VALIDATE_TICKET_TOKEN
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.validated) {
        setIsAuthenticated(true);
        setError("");
        sessionStorage.setItem(
          "validationToken",
          response.data.validationToken
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao validar token");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    stopScanner();
    setIsAuthenticated(false);
    setToken("");
    setResult(null);
    setScanner(null);
  };

  useEffect(() => {
    if (isAuthenticated && result === null) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isAuthenticated, result]);

  useEffect(() => {
    if (scanned) {
      const sendQrResult = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}${
              import.meta.env.VITE_EVENT_SCAN_TICKET
            }`,
            { dispositiveToken: sessionStorage.getItem("validationToken") },
            { headers: { Authorization: `Bearer ${result}` } }
          );
          if (response.data.message) {
            setResult(response.data.message);
          }
        } catch (error: any) {
          if (error.response.data.message) {
            setResult(error.response.data.message);
          }
          console.log("Erro ao enviar requisição qr", error);
        }
      };

      sendQrResult();
    }
  }, [scanned]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      {!isAuthenticated ? (
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Acesso ao Scanner</CardTitle>
            <CardDescription>
              Insira seu token para acessar o scanner de QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Token de Acesso</Label>
              <Input
                id="token"
                type="password"
                placeholder="Digite seu token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && validateToken()}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={validateToken}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Validando..." : "Acessar Scanner"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Leitor de QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {!result ? (
              <>
                <div
                  id={qrCodeRegionId}
                  className={result ? "hidden" : "w-full"}
                  style={{ minHeight: "250px" }}
                />
                <p className="text-muted-foreground text-sm">
                  Aponte sua câmera para um QR Code
                </p>
                <Button
                  variant="outline"
                  onClick={stopScanner}
                  className="w-full"
                >
                  Parar Scanner
                </Button>
                <Button
                  variant="destructive"
                  onClick={logout}
                  className="w-full"
                >
                  Sair
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Badge variant="secondary">QR Code Detectado</Badge>
                <p className="break-all text-sm text-muted-foreground">
                  {result}
                </p>
                <Button
                  variant="outline"
                  onClick={resetScanner}
                  className="w-full"
                >
                  Ler Novamente
                </Button>
                <Button
                  variant="destructive"
                  onClick={logout}
                  className="w-full"
                >
                  Sair
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
