import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Impact — AfriVoice AI",
  description:
    "L'impact d'AfriVoice AI : inclusion numérique, alignement ODD, souveraineté linguistique et transformation sociale en Afrique de l'Ouest.",
};

const IMPACTS = [
  {
    number: "+400M",
    label: "Locuteurs de langues africaines potentiellement concernés",
  },
  {
    number: "≈ 60%",
    label: "Taux d'illettrisme fonctionnel dans certaines zones rurales",
  },
  {
    number: "1 geste",
    label: "Un simple appui pour accéder à un service numérique",
  },
];

const SDGS = [
  {
    code: "ODD 4",
    title: "Éducation de qualité",
    desc: "Un compagnon vocal pour apprendre et se former sans passer par l'écrit.",
  },
  {
    code: "ODD 5",
    title: "Égalité des sexes",
    desc: "Autonomiser les femmes non alphabétisées face au numérique et aux services.",
  },
  {
    code: "ODD 8",
    title: "Travail décent & croissance",
    desc: "Ouvrir l'économie numérique aux entrepreneurs·es informel·les et ruraux·ales.",
  },
  {
    code: "ODD 10",
    title: "Réduire les inégalités",
    desc: "Combler la fracture linguistique du numérique en Afrique de l'Ouest.",
  },
];

const ROADMAP = [
  {
    phase: "Phase 1 — MVP",
    status: "En cours",
    items: [
      "Prototype voice-first (démo actuelle)",
      "Preuve de concept ASR/TTS multi-langues",
      "Candidature STIC'26",
    ],
  },
  {
    phase: "Phase 2 — Pilote terrain",
    status: "6 mois",
    items: [
      "Corpus vocaux annotés (wolof, bambara, mooré)",
      "Pilote santé communautaire (2 villages test)",
      "Partenariats ONG & agents de santé",
    ],
  },
  {
    phase: "Phase 3 — Passage à l'échelle",
    status: "12–18 mois",
    items: [
      "API publique multi-secteurs",
      "Déploiement sur téléphones basiques (USSD/IVR)",
      "Extension à 8+ langues d'Afrique de l'Ouest",
    ],
  },
];

const VOICES = [
  {
    quote:
      "Aujourd'hui, ma grand-mère ne peut pas utiliser un smartphone. Demain, elle pourra simplement lui parler.",
    author: "Vision AfriVoice AI",
  },
  {
    quote:
      "La voix est déjà la première interface humaine. C'est aussi la plus juste.",
    author: "Principe de conception",
  },
];

export default function ImpactPage() {
  return (
    <PageShell
      eyebrow="Impact · ODD & Souveraineté"
      title={
        <>
          Quand la voix devient un <span className="text-gradient">levier</span>
          <br className="hidden sm:block" /> de dignité numérique.
        </>
      }
      intro="AfriVoice AI ne se contente pas de traduire : elle rééquilibre l'accès au savoir, à la santé et aux services. Un impact mesurable, aligné sur les Objectifs de Développement Durable."
    >
      {/* CHIFFRES CLÉS */}
      <div className="grid gap-5 md:grid-cols-3">
        {IMPACTS.map((i) => (
          <div
            key={i.label}
            className="glass rounded-2xl p-6 text-center transition hover:border-sky-400/40"
          >
            <p className="text-3xl font-semibold text-gradient sm:text-4xl">
              {i.number}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {i.label}
            </p>
          </div>
        ))}
      </div>

      {/* ODD */}
      <div className="mt-14">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Alignement stratégique
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">
            Contribuer directement à 4 Objectifs de Développement Durable.
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {SDGS.map((s) => (
            <div
              key={s.code}
              className="glass rounded-2xl p-6 transition hover:border-sky-400/40"
            >
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-300/30 to-sky-500/20 text-xs font-bold text-sky-100">
                  {s.code}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ROADMAP */}
      <div className="mt-14">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Feuille de route
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">
            Du prototype à un service public numérique panafricain.
          </h2>
        </div>

        <ol className="space-y-4">
          {ROADMAP.map((r, i) => (
            <li
              key={r.phase}
              className="glass rounded-2xl p-6 transition hover:border-sky-400/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-sky-400/15 text-sm font-semibold text-sky-200">
                    {i + 1}
                  </span>
                  <h3 className="text-base font-semibold text-slate-100 sm:text-lg">
                    {r.phase}
                  </h3>
                </div>
                <span className="rounded-full border border-sky-400/25 bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-sky-100">
                  {r.status}
                </span>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {r.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300"
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      {/* CITATIONS */}
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {VOICES.map((v) => (
          <blockquote
            key={v.quote}
            className="glass rounded-2xl p-6 sm:p-7"
          >
            <p className="text-base italic leading-relaxed text-slate-100 sm:text-lg">
              « {v.quote} »
            </p>
            <footer className="mt-4 text-[11px] uppercase tracking-[0.18em] text-sky-300/80">
              — {v.author}
            </footer>
          </blockquote>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 px-5 py-3 text-sm font-semibold text-navy-950 shadow-glow transition hover:scale-[1.02] active:scale-100 sm:text-base"
        >
          Devenir partenaire du projet
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </PageShell>
  );
}
