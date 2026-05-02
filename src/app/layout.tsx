import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "سوق الحرفيين — Souq Al-Hirfiyeen",
    template: "%s — سوق الحرفيين",
  },
  description:
    "السوق الرقمي للحرفيين السوريين — نجار، حداد، كهربائي، سباك، دهان، بلّاط في دمشق وريفها",
  manifest: "/manifest.json",
  applicationName: "سوق الحرفيين",
  formatDetection: { telephone: false },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#8B4513",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
