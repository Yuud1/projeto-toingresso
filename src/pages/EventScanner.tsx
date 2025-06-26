import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanEye, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

export default function EventScanner() {
  // Estados para o scanner QR
  const [scannerToken, setScannerToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [scanned, setScanned] = useState(false);
  const qrCodeRegionId = "qr-code-region";
  const isScanning = useRef(false);

  // Funções do scanner QR
  const startScanner = () => {
    const qrElement = document.getElementById(qrCodeRegionId);
    if (!qrElement) {
      console.error(`Elemento com id=${qrCodeRegionId} não encontrado.`);
      return;
    }

    // Se já existe um scanner, pare e limpe antes de criar um novo
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
          createAndStartScanner();
        });
    } else {
      createAndStartScanner();
    }
  };

  const createAndStartScanner = () => {
    setScanned(false);
    const html5QrCode = new Html5Qrcode(qrCodeRegionId);
    setScanner(html5QrCode);

    const config = {
      fps: 30,

      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    };

    html5QrCode
      .start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (!isScanning.current) {
            isScanning.current = true;
            html5QrCode
              .stop()
              .then(() => {
                html5QrCode.clear();
                setScanner(null);
                setScanned(true);
                setScanResult(decodedText);
              })
              .catch((err) => {
                setScanned(false);
                console.error("Erro ao parar scanner após leitura:", err);
              });
          }
        },
        () => {}
      )
      .catch(() => {
        setScanned(false);
        setScannerError(
          "Falha ao iniciar a câmera. Verifique as permissões de acesso e recarregue a página."
        );
      });
  };

  const stopScanner = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          scanner.clear();
          setScanner(null);
          isScanning.current = false;
        })
        .catch((err) => {
          console.error("Erro ao parar scanner:", err);
        });
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    isScanning.current = false;
    stopScanner();
    startScanner();
  };

  const validateToken = async () => {
    if (!scannerToken.trim()) {
      setScannerError("Por favor, insira um token");
      return;
    }

    setIsLoading(true);
    setScannerError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_VALIDATE_TICKET_TOKEN
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${scannerToken}`,
          },
        }
      );

      if (response.data.validated) {
        setIsAuthenticated(true);
        setScannerError("");
        sessionStorage.setItem(
          "validationToken",
          response.data.validationToken
        );
      }
    } catch (err: any) {
      setScannerError(err.response?.data?.message || "Erro ao validar token");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    stopScanner();
    setIsAuthenticated(false);
    setScannerToken("");
    setScanResult(null);
    setScanner(null);
    sessionStorage.removeItem("validationToken");
  };

  useEffect(() => {
    if (isAuthenticated && scanResult === null) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isAuthenticated, scanResult]);

  useEffect(() => {
    if (scanned) {
      const sendQrResult = async () => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}${
              import.meta.env.VITE_EVENT_SCAN_TICKET
            }`,
            { dispositiveToken: sessionStorage.getItem("validationToken") },
            { headers: { Authorization: `Bearer ${scanResult}` } }
          );
          if (response.data.message) {
            setScanResult(response.data.message);
          }
        } catch (error: any) {
          if (error.response?.data?.message) {
            setScanResult(error.response.data.message);
          } else {
            setScanResult("Ocorreu um erro ao validar o ticket.");
          }
          console.log("Erro ao enviar requisição qr", error);
        } finally {
          setScanned(false);
        }
      };
      sendQrResult();
    }
  }, [scanned]);

  return (
    <div className="space-y-6">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-[#014A8E] via-[#014A8E] to-[#014A8E] rounded-2xl p-4 sm:p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <ScanEye className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Scanner de QR Code</h2>
            <p className="text-blue-100 mt-1 text-sm sm:text-base">Escaneie os QR Codes dos ingressos para validar a entrada dos participantes</p>
          </div>
        </div>
      </div>

      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="min-h-[70vh] flex items-center p-4 sm:p-8 md:p-20 justify-center bg-gradient-to-br from-gray-50 to-blue-50">
            {!isAuthenticated ? (
              <Card className="w-full max-w-md border-0 shadow-2xl rounded-2xl overflow-hidden py-0">
                <div className="bg-gradient-to-r from-[#014A8E] to-[#014A8E] p-4 sm:p-6 text-white text-center">
                  <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Acesso ao Scanner</h3>
                  <p className="text-blue-100 text-sm sm:text-base">
                    Insira seu token para acessar o scanner de QR code
                  </p>
                </div>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validateToken();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="token" className="text-sm font-semibold text-gray-700">
                        Token de Acesso
                      </Label>
                      <Input
                        id="token"
                        type="password"
                        placeholder="Digite seu token de acesso"
                        value={scannerToken}
                        onChange={(e) => setScannerToken(e.target.value)}
                        className="h-10 sm:h-12 text-base sm:text-lg border-2 focus-visible:ring-[#014A8E] focus-visible:border-[#014A8E]"
                      />
                    </div>

                    {scannerError && (
                      <Alert variant="destructive" className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700 text-sm">{scannerError}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-10 sm:h-12 bg-gradient-to-r from-[#014A8E] to-[#014A8E] hover:from-[#013d75] hover:to-[#013d75] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                    >
                      {isLoading ? "Validando..." : "Acessar Scanner"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="w-full max-w-2xl">
                <div className="flex flex-col items-center gap-4 sm:gap-6">
                  {!scanResult ? (
                    <>
                      {/* Scanner Container */}
                      <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#014A8E]">
                        <div className="bg-gradient-to-r from-[#014A8E] to-[#014A8E] p-3 sm:p-4 text-white text-center">
                          <ScanEye className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2" />
                          <p className="font-semibold text-sm sm:text-base">Scanner Ativo</p>
                        </div>
                        <div
                          id={qrCodeRegionId}
                          className="w-full h-64 sm:h-80 bg-gray-900"
                          style={{
                            overflow: "hidden",
                          }}
                        />
                      </div>
                      
                      <div className="text-center space-y-3 sm:space-y-4">
                        <p className="text-gray-600 text-base sm:text-lg font-medium">
                          Aponte sua câmera para um QR Code
                        </p>
                        
                        {scannerError && (
                          <Alert variant="destructive" className="border-red-200 bg-red-50">
                            <AlertDescription className="text-red-700 text-sm">{scannerError}</AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            variant="outline"
                            onClick={stopScanner}
                            className="flex-1 h-10 sm:h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                          >
                            Parar Scanner
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={logout}
                            className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                          >
                            Sair
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full max-w-md">
                      <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 text-white text-center">
                          <div className="mx-auto mb-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <ScanEye className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold mb-2">Scan Concluído</h3>
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                            Resultado do Scan
                          </Badge>
                        </div>
                        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                            <p className="break-words text-base sm:text-lg font-medium text-gray-800 text-center">
                              {scanResult}
                            </p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="outline"
                              onClick={resetScanner}
                              className="flex-1 h-10 sm:h-12 border-2 border-[#014A8E] text-[#014A8E] hover:bg-blue-50 text-sm sm:text-base"
                            >
                              Ler Novamente
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={logout}
                              className="flex-1 h-10 sm:h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                            >
                              Sair
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
