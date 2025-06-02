"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Lock, Unlock, Scan } from "lucide-react";
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
import QrScanner from "qr-scanner";

export default function QRScanner() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const scannerRef = useRef<QrScanner | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleQRDetected = async (data: string) => {
    stopScanning();

    setScannedData(data);
    setScanHistory((prev) => [data, ...prev.slice(0, 4)]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${
          import.meta.env.VITE_VALIDATE_TICKET_TOKEN
        }`,
        { code: data },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.validated) {
        alert("QR Code válido!");
      } else {
        alert("QR Code inválido!");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Erro ao validar QR Code");
    }
  };

  const validateToken = async () => {
    if (!token.trim()) {
      setError("Por favor, insira um token");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Substitua pela URL da sua API
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
        sessionStorage.setItem("eventId", response.data.eventId);
      }
    } catch (err: any) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);

        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            handleQRDetected(result.data);
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        scannerRef.current = scanner;
        scanner.start();
      }
    } catch (err) {
      setError("Erro ao acessar a câmera. Verifique as permissões.");
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken("");
    setScannedData("");
    setScanHistory([]);
    stopScanning();
  };

  // Simular detecção de QR code (em produção, use uma biblioteca como qr-scanner)
  const simulateQRDetection = () => {
    const mockQRData = `QR-${Date.now()}`;
    setScannedData(mockQRData);
    setScanHistory((prev) => [mockQRData, ...prev.slice(0, 4)]);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Unlock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Scanner QR Code</CardTitle>
                <CardDescription>Acesso liberado</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </CardHeader>
        </Card>

        {/* Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Scanner</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isScanning ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scan className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  Clique no botão abaixo para iniciar o scanner
                </p>
                <Button onClick={startScanning}>
                  <Camera className="w-4 h-4 mr-2" />
                  Iniciar Scanner
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-white border-dashed m-8 rounded-lg"></div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={stopScanning}
                    variant="outline"
                    className="flex-1"
                  >
                    Parar Scanner
                  </Button>
                  <Button onClick={simulateQRDetection} className="flex-1">
                    Simular Detecção
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultado */}
        {scannedData && (
          <Card>
            <CardHeader>
              <CardTitle>Último QR Code Escaneado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <code className="text-sm break-all">{scannedData}</code>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Histórico */}
        {scanHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scanHistory.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <code className="text-sm">{data}</code>
                    <Badge variant="secondary">
                      #{scanHistory.length - index}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
