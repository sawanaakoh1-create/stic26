import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AfriVoice AI — Votre voix, votre monde numérique",
  description:
    "AfriVoice AI est une infrastructure linguistique d'IA générative qui permet aux populations d'Afrique de l'Ouest d'interagir avec le numérique dans leurs langues locales.",
  keywords: [
    "AfriVoice AI",
    "STIC 2026",
    "IA vocale",
    "inclusion numérique",
    "langues africaines",
    "ASR",
    "TTS",
    "NLP",
  ],
  authors: [{ name: "AKOH N'DJARMA M. Sawanatou" }],
  openGraph: {
    title: "AfriVoice AI — Votre voix, votre monde numérique",
    description:
      "Assistant vocal IA pour l'inclusion numérique en Afrique de l'Ouest.",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2545",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
