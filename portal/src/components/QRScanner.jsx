import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, X } from 'lucide-react';
import { Button } from './UI';

/**
 * QR Code scanner component.
 * Props: onScan(data), onClose()
 */
export default function QRScanner({ onScan, onClose }) {
  const [error, setError] = useState('');
  const scannerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          if (data.eventId && data.code) {
            scanner.stop().catch(() => {});
            onScan(data);
          }
        } catch {
          // Not a valid QR — ignore
        }
      },
      () => {} // ignore scan failures
    ).catch((err) => {
      setError('Camera access denied or not available. Please use the code input instead.');
    });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-white">
            <Camera className="w-5 h-5" />
            <span className="text-sm font-semibold">Scan QR Code</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div id="qr-reader" className="rounded-xl overflow-hidden bg-[var(--color-surface)] border border-white/10" />

        {error && (
          <div className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-center">
            {error}
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">Point your camera at the QR code displayed at the venue</p>

        <Button variant="secondary" onClick={onClose} className="w-full mt-4">Enter Code Manually</Button>
      </div>
    </div>
  );
}
