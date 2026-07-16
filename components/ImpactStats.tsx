"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  /** Valeur finale à atteindre. */
  value: number;
  /** Suffixe affiché après la valeur (M, %, …). */
  suffix: string;
  /** Étiquette courte au-dessus du chiffre. */
  eyebrow: string;
  /** Phrase descriptive sous le chiffre. */
  caption: string;
}

const STATS: Stat[] = [
  {
    value: 60,
    suffix: " %",
    eyebrow: "Analphabétisme",
    caption:
      "de la population adulte en Afrique de l'Ouest ne sait ni lire ni écrire — donc exclue des interfaces textuelles.",
  },
  {
    value: 300,
    suffix: " M",
    eyebrow: "Locuteurs",
    caption:
      "de langues ouest-africaines (Wolof, Bambara, Peul, Mooré, Haoussa…) sans accès natif au numérique.",
  },
  {
    value: 4,
    suffix: "",
    eyebrow: "Langues couvertes",
    caption:
      "par le MVP AfriVoice AI dès le prototype — extensibles à 20+ langues avec le backend FastAPI.",
  },
];

/**
 * Bandeau d'impact chiffré — compteurs animés qui s'incrémentent
 * lorsqu'ils entrent dans le viewport (IntersectionObserver).
 * Donne au pitch une portée sociale immédiate.
 */
export default function ImpactStats() {
  return (
    <section
      aria-label="Impact potentiel"
      className="mx-auto w-full max-w-6xl px-5 py-16"
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/90">
          Impact
        </p>
        <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Un continent, trois chiffres, une urgence.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {STATS.map((stat) => (
          <StatCard key={stat.eyebrow} stat={stat} />
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-slate-500">
        Sources : UNESCO Institute for Statistics, Ethnologue, GSMA Mobile
        Economy West Africa.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------
//  Carte compteur — anime la valeur de 0 à cible en 1,5 s
// ---------------------------------------------------------------
function StatCard({ stat }: { stat: Stat }) {
  const [displayed, setDisplayed] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            animateTo(stat.value, setDisplayed);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <div
      ref={cardRef}
      className="glass rounded-2xl p-5 sm:p-6 transition hover:border-sky-400/40"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300/80">
        {stat.eyebrow}
      </p>
      <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
        <span className="text-gradient">{displayed}</span>
        <span className="text-slate-100">{stat.suffix}</span>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-200/80">
        {stat.caption}
      </p>
    </div>
  );
}

/** Anime de 0 à `target` en ~1,5 s, easing quadratique. */
function animateTo(target: number, setter: (v: number) => void) {
  const duration = 1500;
  const start = performance.now();

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    // easeOutQuad
    const eased = 1 - (1 - t) * (1 - t);
    setter(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
