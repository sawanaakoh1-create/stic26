"use client";

import { useEffect, useMemo, useState } from "react";

interface WaveformProps {
  /**
   * Contrôle l'animation. Quand `false`, les barres retombent à un état plat élégant.
   */
  active: boolean;
  /**
   * Nombre de barres (par défaut 24). Mobile-first : garde une valeur modérée.
   */
  bars?: number;
  /**
   * Couleur Tailwind principale des barres.
   */
  colorClass?: string;
}

/**
 * Waveform SVG animé, purement front (pas de dépendance audio native).
 * Simule visuellement l'écoute vocale pendant l'enregistrement.
 */
export default function Waveform({
  active,
  bars = 24,
  colorClass = "fill-sky-300",
}: WaveformProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setTick((t) => (t + 1) % 1000);
    }, 90);
    return () => window.clearInterval(id);
  }, [active]);

  // Pré-calcule des "phases" pour un rendu SSR déterministe puis vivant côté client.
  const phases = useMemo(
    () => Array.from({ length: bars }, (_, i) => (i * 37) % 100),
    [bars]
  );

  const width = 320;
  const height = 72;
  const barWidth = 4;
  const gap = (width - bars * barWidth) / (bars + 1);
  const centerY = height / 2;

  return (
    <div
      role="img"
      aria-label={active ? "Écoute vocale en cours" : "Onde sonore en pause"}
      className="w-full max-w-sm"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-16 w-full sm:h-20"
      >
        {phases.map((phase, i) => {
          // Amplitude simulée : varie doucement selon le tick, avec un profil "gaussien"
          const distFromCenter = Math.abs(i - bars / 2) / (bars / 2);
          const envelope = 1 - distFromCenter * 0.55;
          const t = (tick + phase) / 6;
          const raw = Math.sin(t) * 0.5 + Math.sin(t * 1.7 + i) * 0.35;
          const amp = active ? Math.abs(raw) * envelope : 0.06;
          const h = Math.max(6, amp * (height - 12));
          const x = gap + i * (barWidth + gap);
          const y = centerY - h / 2;

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx={barWidth / 2}
              className={`${colorClass} transition-all duration-150 ease-out`}
              opacity={active ? 0.85 : 0.35}
            />
          );
        })}
      </svg>
    </div>
  );
}
