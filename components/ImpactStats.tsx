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
    value: 8,
    suffix: " M",
    eyebrow: "Locuteurs Mooré",
    caption:
      "utilisent le Mooré au quotidien au Burkina Faso — majoritairement exclus des interfaces numériques textuelles.",
  },
  {
    value: 65,
    suffix: " %",
    eyebrow: "Analphabétisme",
    caption:
      "des adultes burkinabé ne lisent pas couramment le français — la voix devient donc la seule interface véritablement inclusive.",
  },
  {
    value: 4,
    suffix: "",
    eyebrow: "Secteurs démontrés",
    caption:
      "agriculture, santé, finance, éducation — quatre cas d'usage Mooré joués en direct dans ce prototype MVP.",
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
      className="mx-auto w-full max-w-6xl px-5 py-12 sm:py-16"
    >
      <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-300/90 sm:text-[11px] sm:tracking-[0.18em]">
          Impact
        </p>
        <h2 className="mt-2 max-w-2xl text-xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
          Un pays, une langue, une urgence.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
        {STATS.map((stat) => (
          <StatCard key={stat.eyebrow} stat={stat} />
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-slate-500">
        Sources : UNESCO Institute for Statistics, Ethnologue, INSD Burkina Faso.
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
      className="glass rounded-2xl p-4 sm:p-6 transition hover:border-sky-400/40"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-300/80 sm:text-[11px] sm:tracking-[0.16em]">
        {stat.eyebrow}
      </p>
      <p className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-50 sm:mt-2 sm:text-5xl">
        <span className="text-gradient">{displayed}</span>
        <span className="text-slate-100">{stat.suffix}</span>
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-200/80 sm:mt-3 sm:text-sm">
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
