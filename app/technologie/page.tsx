import type { Metadata } from "next";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Technologie — AfriVoice AI",
  description:
    "Architecture technique d'AfriVoice AI : pipeline ASR → NLP → TTS, modèles fine-tunés sur corpus africains, stack Next.js + IA générative.",
};

const PIPELINE = [
  {
    step: "01",
    title: "ASR — Reconnaissance vocale",
    desc: "Modèles Whisper / MMS fine-tunés sur des corpus locaux (wolof, bambara, mooré, haoussa, fon, éwé, dioula…). Robustesse au bruit, aux accents et au code-switching.",
    tech: ["Whisper", "Meta MMS", "wav2vec 2.0"],
  },
  {
    step: "02",
    title: "NLP — Compréhension contextuelle",
    desc: "Un LLM léger orienté RAG interroge une base de connaissances sectorielle (santé, agriculture, admin, éducation) pour formuler des réponses fiables et sourcées.",
    tech: ["LLM open-source", "RAG", "Vector DB"],
  },
  {
    step: "03",
    title: "TTS — Synthèse vocale humanisée",
    desc: "Voix locales pré-entraînées (Coqui TTS, XTTS, Bark) restituent la réponse à voix haute, avec intonation naturelle et prononciation adaptée.",
    tech: ["Coqui XTTS", "Bark", "Piper"],
  },
];

const STACK = [
  {
    title: "Front-end",
    items: [
      "Next.js 14 (App Router)",
      "React 18 · TypeScript",
      "Tailwind CSS · animations custom",
      "Web Speech API (démo TTS navigateur)",
    ],
  },
  {
    title: "IA & données",
    items: [
      "Pipeline ASR → NLP → TTS",
      "Corpus vocaux annotés multilingues",
      "RAG sur base sectorielle vérifiée",
      "Fine-tuning progressif langue par langue",
    ],
  },
  {
    title: "Qualité & éthique",
    items: [
      "Cible WER (Word Error Rate) < 15 %",
      "Consentement & anonymisation par défaut",
      "Modèles auditables (open-source first)",
      "Contribution des locuteurs natifs",
    ],
  },
];

const METRICS = [
  { value: "8+", label: "Langues locales visées" },
  { value: "< 2s", label: "Latence cible aller-retour" },
  { value: "95%", label: "Cible de précision ASR" },
  { value: "0 €", label: "Coût pour l'utilisateur final" },
];

export default function TechnologiePage() {
  return (
    <PageShell
      eyebrow="Technologie · Pipeline IA"
      title={
        <>
          Sous le capot d&apos;<span className="text-gradient">AfriVoice AI</span>
        </>
      }
      intro="Une architecture voice-first, modulaire et souveraine. Chaque brique est choisie pour être adaptable aux langues africaines, économe en ressources et déployable même en connectivité faible."
    >
      {/* MÉTRIQUES */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="glass flex flex-col items-center rounded-2xl p-5 text-center"
          >
            <p className="text-2xl font-semibold text-gradient sm:text-3xl">
              {m.value}
            </p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400 sm:text-xs">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* PIPELINE */}
      <div className="mt-14">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Pipeline
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">
            De la voix humaine à la voix IA, en 3 étapes.
          </h2>
        </div>

        <div className="relative grid gap-5 md:grid-cols-3">
          {PIPELINE.map((p) => (
            <div
              key={p.step}
              className="glass relative overflow-hidden rounded-2xl p-6 transition hover:border-sky-400/40"
            >
              <span
                aria-hidden
                className="absolute -right-4 -top-6 text-6xl font-bold text-white/5"
              >
                {p.step}
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
                Étape {p.step}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-100">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {p.desc}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-white/5 px-2 py-1 text-[11px] font-medium text-slate-300"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* STACK */}
      <div className="mt-14">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Stack technique
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100 sm:text-3xl">
            Une base moderne, sobre et souveraine.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {STACK.map((s) => (
            <div key={s.title} className="glass rounded-2xl p-6">
              <h3 className="text-base font-semibold text-slate-100">
                {s.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {s.items.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300"
                    />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* NOTE MVP */}
      <div className="mt-14">
        <div className="glass rounded-3xl border-sky-400/20 p-6 sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300/80">
            Statut MVP
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100 sm:text-2xl">
            Le prototype actuel simule le pipeline complet côté client.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Cette démo utilise la Web Speech API du navigateur pour la synthèse
            vocale et un mock de réponses sectorielles. La prochaine itération
            connectera de véritables modèles ASR / NLP / TTS entraînés sur nos
            corpus locaux via une API sécurisée.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
