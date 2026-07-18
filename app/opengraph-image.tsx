import { ImageResponse } from "next/og";

// Génère dynamiquement l'image Open Graph (1200×630) utilisée pour les
// aperçus WhatsApp / LinkedIn / Twitter lorsqu'on partage le lien Vercel.
// Aucune image binaire à uploader — Next.js la produit à la volée.
export const runtime = "edge";
export const alt = "AfriVoice AI — Parlez Mooré, entrez dans le numérique";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "radial-gradient(1200px 800px at 15% -10%, rgba(232, 138, 74, 0.35), transparent 55%), radial-gradient(900px 700px at 110% 15%, rgba(242, 173, 107, 0.20), transparent 60%), linear-gradient(180deg, #0a0503 0%, #150c07 55%, #1e120b 100%)",
          color: "#f6ede1",
          fontFamily: "sans-serif",
        }}
      >
        {/* HEADER */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background:
                "linear-gradient(135deg, #f2ad6b 0%, #e88a4a 60%, #c8632a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0a0503",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 24, fontWeight: 600 }}>
              AfriVoice <span style={{ color: "#f2ad6b" }}>AI</span>
            </span>
            <span
              style={{
                fontSize: 13,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#c5b7a6",
              }}
            >
              Voice-first · Mooré · Burkina Faso
            </span>
          </div>
        </div>

        {/* CORPS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              alignSelf: "flex-start",
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(242, 173, 107, 0.4)",
              background: "rgba(242, 173, 107, 0.08)",
              color: "#fbe6c8",
              fontSize: 16,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            STIC&apos;26 · MVP Phase 1 · Mooré
          </div>

          <div
            style={{
              fontSize: 84,
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: -1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Parlez Mooré,</span>
            <span
              style={{
                background:
                  "linear-gradient(90deg, #fdf6ec 0%, #f2ad6b 55%, #e88a4a 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              entrez dans le numérique.
            </span>
          </div>

          <div
            style={{
              fontSize: 26,
              lineHeight: 1.35,
              color: "#e8d8c4",
              maxWidth: 900,
            }}
          >
            MVP STIC&apos;26 : un assistant vocal IA qui écoute le Mooré,
            comprend l&apos;intention et répond à voix haute. Agriculture,
            santé, finance, éducation — sans lecture, sans clavier.
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#c5b7a6",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <span>Mooré · Burkina Faso · 4 secteurs</span>
          <span>AKOH N&apos;DJARMA M. Sawanatou</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
