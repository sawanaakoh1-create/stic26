import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  ),
  title: "AfriVoice AI — Parlez Mooré, entrez dans le numérique",
  description:
    "AfriVoice AI est une infrastructure d'IA vocale voice-first. MVP STIC'26 focalisé sur le Mooré (8 M de locuteurs, Burkina Faso) : agriculture, santé, finance, éducation.",
  keywords: [
    "AfriVoice AI",
    "STIC 2026",
    "IA vocale",
    "inclusion numérique",
    "langues africaines",
    "Mooré",
    "Burkina Faso",
    "ASR",
    "TTS",
    "NLP",
    "voice-first",
  ],
  authors: [{ name: "AKOH N'DJARMA M. Sawanatou" }],
  creator: "AKOH N'DJARMA M. Sawanatou",
  openGraph: {
    title: "AfriVoice AI — Parlez Mooré, entrez dans le numérique",
    description:
      "MVP STIC'26 : assistant vocal IA en Mooré pour l'inclusion numérique au Burkina Faso.",
    type: "website",
    locale: "fr_FR",
    siteName: "AfriVoice AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AfriVoice AI — Parlez Mooré, entrez dans le numérique",
    description:
      "MVP STIC'26 : assistant vocal IA en Mooré pour l'inclusion numérique au Burkina Faso.",
    creator: "@afrivoiceai",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0705",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
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
