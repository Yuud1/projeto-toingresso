import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QrCodeScanner = ({ onScan }: { onScan: (result: string) => void }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false
      );

      scanner.render(
        (decodedText) => {
          onScan(decodedText);
          setScanning(false);
          scanner.clear();
        },
        (error) => {
          console.warn("QR Code no match", error);
        }
      );

      return () => {
        scanner.clear().catch((error) => console.error("Failed to clear scanner", error));
      };
    }
  }, [onScan]);

  return (
    <div className="flex flex-col items-center justify-center">
      {scanning ? (
        <div id="reader" ref={scannerRef}></div>
      ) : (
        <p className="text-green-500">QR Code lido com sucesso!</p>
      )}
    </div>
  );
};

export default QrCodeScanner;
