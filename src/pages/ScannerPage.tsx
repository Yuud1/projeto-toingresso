import QrCodeScanner from "@/components/QrcodeScanner";
import { useState } from "react";


function ScannerPage() {
  const [result, setResult] = useState<string | null>(null);

  const handleScan = (decodedText: string) => {
    setResult(decodedText);
    console.log("Resultado do QR:", decodedText);
    // Aqui você pode fazer uma requisição para validar ingresso, por exemplo.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Leitor de QR Code</h1>
      {result ? (
        <div className="bg-green-100 p-4 rounded">
          <p className="text-lg">Resultado: {result}</p>
        </div>
      ) : (
        <QrCodeScanner onScan={handleScan} />
      )}
    </div>
  );
}

export default ScannerPage;
