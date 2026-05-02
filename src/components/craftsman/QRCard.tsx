"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

export default function QRCard({ url }: { url: string }) {
  const locale = useLocale() as "ar" | "en";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    import("qrcode").then((QRCode) => {
      if (cancelled || !canvasRef.current) return;
      QRCode.toCanvas(canvasRef.current, url, {
        width: 160,
        margin: 2,
        color: { dark: "#1C2833", light: "#F5F0E8" },
      });
    });
    return () => { cancelled = true; };
  }, [url]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "maalem-qr.png";
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-cream-50 border border-clay-100 rounded-xl w-fit">
      <canvas ref={canvasRef} className="rounded-lg" />
      <button
        onClick={download}
        className="text-xs text-charcoal-500 hover:text-clay underline transition-colors"
      >
        {locale === "ar" ? "تحميل QR" : "Download QR"}
      </button>
    </div>
  );
}
